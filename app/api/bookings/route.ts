import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { meetingId } = await request.json();

  if (!meetingId) {
    return NextResponse.json(
      { error: "Meeting ID required" },
      { status: 400 }
    );
  }

  try {
    // Check if meeting exists and get host
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      select: { hostId: true },
    });

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    // Check if booking already exists
    const existingBooking = await prisma.coHostBooking.findUnique({
      where: { meetingId_userId: { meetingId, userId: session.user.id } },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Booking already exists" },
        { status: 400 }
      );
    }

    const booking = await prisma.coHostBooking.create({
      data: {
        meetingId,
        userId: session.user.id,
        status: "pending",
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        meeting: {
          select: { id: true, title: true },
        },
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("[v0] Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all pending bookings for meetings hosted by the user
    const bookings = await prisma.coHostBooking.findMany({
      where: {
        meeting: {
          hostId: session.user.id,
        },
        status: "pending",
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        meeting: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("[v0] Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
