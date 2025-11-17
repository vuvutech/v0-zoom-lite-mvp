"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/use-socket";
import { usePeerConnection } from "@/hooks/use-peer-connection";
import { VideoContainer } from "@/components/video-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { MeetingChat } from "@/components/meeting-chat";

interface MeetingRoomProps {
  meetingId: string;
}

export function MeetingRoom({ meetingId }: MeetingRoomProps) {
  const { data: session } = useSession();
  const socket = useSocket(`/meeting/${meetingId}`);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [participants, setParticipants] = useState<string[]>([]);

  const {
    localStream,
    remoteStream,
    isConnected,
    error: rtcError,
    cleanup,
  } = usePeerConnection(meetingId, session?.user?.id || "", socket, {
    audio: isAudioOn,
    video: isVideoOn,
  });

  // Handle participants
  useEffect(() => {
    if (!socket) return;

    const handleUserJoined = (userId: string) => {
      console.log("[v0] User joined:", userId);
      setParticipants((prev) => [...new Set([...prev, userId])]);
    };

    const handleUserLeft = (userId: string) => {
      console.log("[v0] User left:", userId);
      setParticipants((prev) => prev.filter((id) => id !== userId));
    };

    socket.on("user-joined", handleUserJoined);
    socket.on("user-left", handleUserLeft);

    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("user-left", handleUserLeft);
    };
  }, [socket]);

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioOn;
      });
      setIsAudioOn(!isAudioOn);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoOn;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  // Leave meeting
  const handleLeave = () => {
    cleanup();
    socket?.disconnect();
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-background flex gap-4 p-4">
      <div className="flex-1 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
          <div>
            <VideoContainer
              stream={localStream}
              isLocal
              className="w-full aspect-video"
              muted
            />
            <p className="text-sm text-muted-foreground mt-2">You</p>
          </div>

          <div>
            <VideoContainer
              stream={remoteStream}
              className="w-full aspect-video"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {participants.length > 0 ? "Participant" : "Waiting..."}
            </p>
          </div>
        </div>

        {/* Meeting controls */}
        <Card className="p-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={toggleAudio}
              variant={isAudioOn ? "default" : "destructive"}
              size="lg"
              className="rounded-full w-14 h-14"
            >
              {isAudioOn ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 16.91c-1.48 1.46-3.51 2.37-5.75 2.37-2.24 0-4.27-.91-5.75-2.37M19 12h2c0 .89-.24 1.73-.67 2.45m-2.67-6.45H21c.37 1.23.58 2.55.58 3.95v.01" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.81c0-.06 0-.13 0-.19V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.48L5.84 2.81L4.43 4.22l16.54 16.54 1.41-1.41L15.98 11.81zM12 4c.66 0 1.2.53 1.2 1.2v1.02L10.8 4.74c.2-.39.59-.74 1.2-.74zm1.2 9.46v2.54c0 .66-.54 1.2-1.2 1.2-.13 0-.26-.02-.39-.05l-.53-.53-.54-.54c.19.01.38.12.46.12.66 0 1.2-.54 1.2-1.2v-1.54z" />
                </svg>
              )}
            </Button>

            <Button
              onClick={toggleVideo}
              variant={isVideoOn ? "default" : "destructive"}
              size="lg"
              className="rounded-full w-14 h-14"
            >
              {isVideoOn ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15 8v8H5V8h10m1-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-6.5l4 4v-11l-4 4V6c0-1.1-.9-2-2-2z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 9.5V7c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2v-2.5l4 4v-11l-4 4z" />
                </svg>
              )}
            </Button>

            <Button
              onClick={handleLeave}
              variant="destructive"
              size="lg"
              className="rounded-full"
            >
              Leave
            </Button>
          </div>

          {rtcError && (
            <p className="text-destructive text-sm text-center mt-4">{rtcError}</p>
          )}
        </Card>
      </div>

      {/* Chat sidebar */}
      <div className="w-80 hidden lg:block">
        <MeetingChat roomId={meetingId} />
      </div>
    </div>
  );
}
