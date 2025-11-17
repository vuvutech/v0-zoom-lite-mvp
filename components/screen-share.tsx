"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ScreenShareProps {
  onScreenShare?: (stream: MediaStream) => void;
  onScreenShareStop?: () => void;
}

export function ScreenShare({ onScreenShare, onScreenShareStop }: ScreenShareProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShareScreen = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" } as any,
        audio: false,
      });

      setIsSharing(true);
      setError(null);
      onScreenShare?.(displayStream);

      // Handle when user stops sharing
      displayStream.getVideoTracks()[0].onended = () => {
        handleStopShare();
      };
    } catch (err: any) {
      if (err.name !== "NotAllowedError") {
        setError("Failed to start screen sharing");
        console.error("[v0] Screen share error:", err);
      }
    }
  };

  const handleStopShare = () => {
    setIsSharing(false);
    onScreenShareStop?.();
  };

  return (
    <div>
      <Button
        onClick={isSharing ? handleStopShare : handleShareScreen}
        variant={isSharing ? "destructive" : "default"}
        size="lg"
        className="rounded-full"
      >
        {isSharing ? (
          <>
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h12c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            </svg>
            Stop Sharing
          </>
        ) : (
          <>
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Share Screen
          </>
        )}
      </Button>
      {error && (
        <p className="text-destructive text-xs mt-2">{error}</p>
      )}
    </div>
  );
}
