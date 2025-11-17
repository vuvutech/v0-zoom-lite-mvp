"use client";

import useSWR from "swr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isPast } from "date-fns";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function MeetingList() {
  const { data: meetings, isLoading, error } = useSWR("/api/meetings", fetcher);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="pt-6">
          <p className="text-destructive text-sm">Error loading meetings. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  if (!meetings || meetings.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="pt-12 text-center">
          <p className="text-muted-foreground mb-4">No meetings yet</p>
          <p className="text-sm text-muted-foreground">Create your first meeting to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3">
      {meetings?.map((meeting: any) => {
        const isPastMeeting = isPast(new Date(meeting.start_time));
        return (
          <Card key={meeting.id} className="border-border/50 hover:border-accent/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{meeting.title}</CardTitle>
                    {isPastMeeting && (
                      <Badge variant="secondary" className="text-xs">Completed</Badge>
                    )}
                  </div>
                  {meeting.description && (
                    <CardDescription className="line-clamp-2">{meeting.description}</CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {format(new Date(meeting.start_time), "MMM d, yyyy HH:mm")}
              </div>
              <Link href={`/meeting/${meeting.id}`}>
                <Button size="sm" disabled={isPastMeeting}>
                  {isPastMeeting ? "Completed" : "Join"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
