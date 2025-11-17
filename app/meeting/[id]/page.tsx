import { MeetingRoom } from "@/components/meeting-room";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from 'next/navigation';

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user) {
    redirect("/signin");
  }

  const { id } = await params;

  return (
    <main className="min-h-screen bg-background">
      <MeetingRoom meetingId={id} />
    </main>
  );
}
