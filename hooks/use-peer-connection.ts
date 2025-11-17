"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { createPeerConnection, getLocalStream, stopStream, SignalingMessage } from "@/lib/webrtc";

export interface UseStreamOptions {
  audio?: boolean;
  video?: boolean;
  onRemoteStream?: (stream: MediaStream) => void;
  onError?: (error: Error) => void;
}

export function usePeerConnection(
  roomId: string,
  userId: string,
  socket: any,
  options: UseStreamOptions = {}
) {
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize local stream
  const initializeLocalStream = useCallback(async () => {
    try {
      const stream = await getLocalStream(options.audio !== false, options.video !== false);
      localStreamRef.current = stream;
      setLocalStream(stream);

      if (peerConnectionRef.current) {
        stream.getTracks().forEach((track) => {
          peerConnectionRef.current!.addTrack(track, stream);
        });
      }
    } catch (err: any) {
      const error = new Error(`Failed to get local stream: ${err.message}`);
      setError(error.message);
      options.onError?.(error);
    }
  }, [options]);

  // Initialize peer connection
  const initializePeerConnection = useCallback(() => {
    const peerConnection = createPeerConnection();
    peerConnectionRef.current = peerConnection;
    remoteStreamRef.current = new MediaStream();
    setRemoteStream(remoteStreamRef.current);

    peerConnection.ontrack = (event: RTCTrackEvent) => {
      console.log("[v0] Remote track received:", event.track.kind);
      event.streams[0].getTracks().forEach((track) => {
        remoteStreamRef.current?.addTrack(track);
      });
    };

    peerConnection.onconnectionstatechange = () => {
      console.log("[v0] Connection state:", peerConnection.connectionState);
      if (peerConnection.connectionState === "connected") {
        setIsConnected(true);
      } else if (
        peerConnection.connectionState === "disconnected" ||
        peerConnection.connectionState === "failed"
      ) {
        setIsConnected(false);
      }
    };

    peerConnection.onicecandidateserror = (event: RTCPeerConnectionIceErrorEvent) => {
      console.error("[v0] ICE error:", event.errorText);
    };

    peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        console.log("[v0] Sending ICE candidate");
        socket?.emit("ice-candidate", {
          type: "ice-candidate",
          from: userId,
          to: roomId,
          data: event.candidate,
          roomId,
        } as SignalingMessage);
      }
    };

    return peerConnection;
  }, [roomId, userId, socket]);

  // Handle signaling messages
  const handleSignalingMessage = useCallback(
    async (message: SignalingMessage) => {
      if (!peerConnectionRef.current) return;

      try {
        if (message.type === "offer") {
          console.log("[v0] Received offer");
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(message.data));
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          socket?.emit("answer", {
            type: "answer",
            from: userId,
            to: message.from,
            data: answer,
            roomId,
          } as SignalingMessage);
        } else if (message.type === "answer") {
          console.log("[v0] Received answer");
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(message.data));
        } else if (message.type === "ice-candidate") {
          console.log("[v0] Received ICE candidate");
          try {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(message.data));
          } catch (error) {
            console.error("[v0] Error adding ICE candidate:", error);
          }
        }
      } catch (error) {
        console.error("[v0] Error handling signaling message:", error);
      }
    },
    [userId, roomId, socket]
  );

  // Setup WebRTC
  useEffect(() => {
    const setup = async () => {
      try {
        initializePeerConnection();
        await initializeLocalStream();
      } catch (error) {
        console.error("[v0] Error setting up WebRTC:", error);
      }
    };

    setup();

    // Listen to signaling messages
    socket?.on("offer", handleSignalingMessage);
    socket?.on("answer", handleSignalingMessage);
    socket?.on("ice-candidate", handleSignalingMessage);

    return () => {
      socket?.off("offer", handleSignalingMessage);
      socket?.off("answer", handleSignalingMessage);
      socket?.off("ice-candidate", handleSignalingMessage);
    };
  }, [socket, initializePeerConnection, initializeLocalStream, handleSignalingMessage]);

  // Cleanup
  const cleanup = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      stopStream(localStreamRef.current);
      localStreamRef.current = null;
    }
    setLocalStream(null);
    setRemoteStream(null);
    setIsConnected(false);
  }, []);

  return {
    localStream,
    remoteStream,
    isConnected,
    error,
    cleanup,
    peerConnection: peerConnectionRef.current,
  };
}
