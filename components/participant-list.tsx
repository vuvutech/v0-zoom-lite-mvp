"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Participant {
  id: string;
  name: string;
  email: string;
  isHost: boolean;
  isAudioOn: boolean;
  isVideoOn: boolean;
  joinedAt: Date;
}

interface ParticipantListProps {
  participants: Participant[];
  currentUserId: string;
}

export function ParticipantList({
  participants,
  currentUserId,
}: ParticipantListProps) {
  const sortedParticipants = participants.sort((a, b) => {
    // Host first
    if (a.isHost !== b.isHost) return a.isHost ? -1 : 1;
    // Then by join time
    return a.joinedAt.getTime() - b.joinedAt.getTime();
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          Participants ({participants.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-2 pr-4">
            {sortedParticipants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {getInitials(participant.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {participant.name}
                    {participant.id === currentUserId && (
                      <span className="text-xs text-muted-foreground ml-1">
                        (You)
                      </span>
                    )}
                  </p>
                  {participant.isHost && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      Host
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  {participant.isAudioOn ? (
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-destructive" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.81c0-.06 0-.13 0-.19V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.48L5.84 2.81L4.43 4.22l16.54 16.54 1.41-1.41L15.98 11.81z" />
                    </svg>
                  )}
                  {participant.isVideoOn ? (
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15 8v8H5V8h10m1-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-6.5l4 4v-11l-4 4V6c0-1.1-.9-2-2-2z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-destructive" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 9.5V7c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2v-2.5l4 4v-11l-4 4z" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
