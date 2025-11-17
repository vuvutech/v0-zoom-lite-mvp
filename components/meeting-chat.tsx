"use client";

import { useState, useEffect, useRef } from "react";
import { useSocket } from "@/hooks/use-socket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
}

interface MeetingChatProps {
  meetingId: string;
  userId: string;
  userName: string;
}

export function MeetingChat({ meetingId, userId, userName }: MeetingChatProps) {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join the meeting room
    socket.emit("join-meeting", { meetingId, userId, userName });

    // Listen for new messages
    socket.on("new-message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("new-message");
    };
  }, [socket, isConnected, meetingId, userId, userName]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !socket || !isConnected) return;

    socket.emit("send-message", {
      meetingId,
      userId,
      userName,
      message: inputValue,
    });

    setInputValue("");
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className="text-sm">
                <div className="font-medium text-foreground">{msg.userName}</div>
                <div className="text-muted-foreground">{msg.message}</div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={!isConnected}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!isConnected || !inputValue.trim()}
          >
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
