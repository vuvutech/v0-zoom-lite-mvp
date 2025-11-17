import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from 'next/navigation';
import { UserMenu } from "@/components/user-menu";
import { MeetingList } from "@/components/meeting-list";
import { CreateMeetingForm } from "@/components/create-meeting-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border/50 sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="space-y-1">
            <Link href="/dashboard" className="text-2xl font-bold hover:opacity-80 transition-opacity">
              ZoomLite
            </Link>
            <p className="text-xs text-muted-foreground">Meeting Host: {session.user.name}</p>
          </div>
          <UserMenu />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="space-y-8">
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">New Meeting</CardTitle>
                  <CardDescription>Create a new meeting or start an instant meeting</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CreateMeetingForm />
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Your Meetings</h2>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Refresh
                </Button>
              </Link>
            </div>
            <MeetingList />
          </div>
        </div>
      </div>
    </main>
  );
}
