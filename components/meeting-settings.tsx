"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MeetingSettingsProps {
  meetingId: string;
  isHost: boolean;
  onRecordingToggle?: (isRecording: boolean) => void;
}

export function MeetingSettings({
  meetingId,
  isHost,
  onRecordingToggle,
}: MeetingSettingsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [allowChat, setAllowChat] = useState(true);
  const [allowScreenShare, setAllowScreenShare] = useState(true);

  const handleRecordingToggle = (value: boolean) => {
    setIsRecording(value);
    onRecordingToggle?.(value);
  };

  if (!isHost) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Meeting Settings</DialogTitle>
          <DialogDescription>
            Configure your meeting preferences and features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="recording" className="flex flex-col gap-1">
              <span>Record Meeting</span>
              <span className="text-xs text-muted-foreground font-normal">
                Save this meeting for later
              </span>
            </Label>
            <Switch
              id="recording"
              checked={isRecording}
              onCheckedChange={handleRecordingToggle}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="chat" className="flex flex-col gap-1">
              <span>Allow Chat</span>
              <span className="text-xs text-muted-foreground font-normal">
                Let participants send messages
              </span>
            </Label>
            <Switch
              id="chat"
              checked={allowChat}
              onCheckedChange={setAllowChat}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="screen" className="flex flex-col gap-1">
              <span>Allow Screen Share</span>
              <span className="text-xs text-muted-foreground font-normal">
                Participants can share their screen
              </span>
            </Label>
            <Switch
              id="screen"
              checked={allowScreenShare}
              onCheckedChange={setAllowScreenShare}
            />
          </div>
        </div>

        <Button className="w-full">Save Settings</Button>
      </DialogContent>
    </Dialog>
  );
}
