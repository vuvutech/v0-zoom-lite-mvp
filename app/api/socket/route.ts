import { Server as NetServer } from "net";
import { NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";
import { NextRequest } from "next/server";

// Socket.io server initialization
let io: IOServer | null = null;

function initializeSocket(res: any) {
  if (io) return io;

  io = new IOServer(res.socket.server, {
    path: "/api/socket",
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  // Socket event handlers
  io.on("connection", (socket) => {
    console.log("[v0] Socket connected:", socket.id);

    // Join room for meeting
    socket.on("join-meeting", ({ meetingId, userId, userName }) => {
      socket.join(`meeting-${meetingId}`);
      io?.to(`meeting-${meetingId}`).emit("user-joined", {
        userId,
        userName,
        socketId: socket.id,
      });
    });

    // Handle chat messages
    socket.on("send-message", ({ meetingId, userId, userName, message }) => {
      io?.to(`meeting-${meetingId}`).emit("new-message", {
        userId,
        userName,
        message,
        timestamp: new Date().toISOString(),
      });
    });

    // WebRTC signaling
    socket.on("webrtc-offer", ({ meetingId, to, offer }) => {
      io?.to(to).emit("webrtc-offer", {
        from: socket.id,
        offer,
      });
    });

    socket.on("webrtc-answer", ({ meetingId, to, answer }) => {
      io?.to(to).emit("webrtc-answer", {
        from: socket.id,
        answer,
      });
    });

    socket.on("webrtc-ice-candidate", ({ meetingId, to, candidate }) => {
      io?.to(to).emit("webrtc-ice-candidate", {
        from: socket.id,
        candidate,
      });
    });

    // Leave meeting
    socket.on("leave-meeting", ({ meetingId, userId, userName }) => {
      socket.leave(`meeting-${meetingId}`);
      io?.to(`meeting-${meetingId}`).emit("user-left", {
        userId,
        userName,
      });
    });

    socket.on("disconnect", () => {
      console.log("[v0] Socket disconnected:", socket.id);
    });
  });

  return io;
}

export async function GET(req: NextRequest) {
  // Initialize Socket.io server if not already initialized
  const res = new NextApiResponse();
  initializeSocket(res);

  return new Response(JSON.stringify({ message: "Socket.io initialized" }), {
    status: 200,
  });
}
