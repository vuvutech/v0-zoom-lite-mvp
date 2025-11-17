"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function CreateMeetingForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          startTime,
        }),
      });

      if (!response.ok) throw new Error("Failed to create meeting");

      const meeting = await response.json();
      router.push(`/meeting/${meeting.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create meeting. Please try again.");
      console.error("Error creating meeting:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title" className="font-medium">Meeting Title</Label>
        <Input
          id="title"
          placeholder="e.g., Team Standup"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="rounded-lg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="font-medium">Description (optional)</Label>
        <Textarea
          id="description"
          placeholder="Add meeting details or agenda..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-lg resize-none"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="startTime" className="font-medium">Start Time</Label>
        <Input
          id="startTime"
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className="rounded-lg"
        />
      </div>

      {error && (
        <Alert variant="destructive" className="rounded-lg">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isLoading} size="lg" className="w-full rounded-lg font-semibold">
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
            Creating...
          </span>
        ) : (
          "Create Meeting"
        )}
      </Button>
    </form>
  );
}
