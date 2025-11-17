import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[v0] Starting database seed...\n');

  // Clean existing data
  console.log('[v0] Cleaning existing data...');
  await prisma.chatMessage.deleteMany({});
  await prisma.coHostBooking.deleteMany({});
  await prisma.participant.deleteMany({});
  await prisma.meeting.deleteMany({});
  await prisma.verification.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('[v0] Data cleaned\n');

  // Create test users
  console.log('[v0] Creating test users...');
  
  const hashedPassword = await bcrypt.hash('password123', 10);

  const alice = await prisma.user.create({
    data: {
      id: 'user_alice_001',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      emailVerified: true,
      image: null,
    },
  });

  const bob = await prisma.user.create({
    data: {
      id: 'user_bob_001',
      name: 'Bob Smith',
      email: 'bob@example.com',
      emailVerified: true,
      image: null,
    },
  });

  const charlie = await prisma.user.create({
    data: {
      id: 'user_charlie_001',
      name: 'Charlie Davis',
      email: 'charlie@example.com',
      emailVerified: true,
      image: null,
    },
  });

  console.log(`[v0] Created users: ${alice.name}, ${bob.name}, ${charlie.name}\n`);

  // Create test meetings
  console.log('[v0] Creating test meetings...');

  const now = new Date();
  const futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

  const meeting1 = await prisma.meeting.create({
    data: {
      id: 'meeting_001',
      title: 'Team Standup',
      description: 'Daily team synchronization meeting',
      roomId: 'room_standup_001',
      hostId: alice.id,
      status: 'scheduled',
      scheduledAt: futureDate,
    },
  });

  const meeting2 = await prisma.meeting.create({
    data: {
      id: 'meeting_002',
      title: 'Project Planning Q1 2025',
      description: 'Quarterly planning and goal setting',
      roomId: 'room_planning_001',
      hostId: bob.id,
      status: 'scheduled',
      scheduledAt: new Date(futureDate.getTime() + 2 * 60 * 60 * 1000),
    },
  });

  const meeting3 = await prisma.meeting.create({
    data: {
      id: 'meeting_003',
      title: 'Client Presentation',
      description: 'Presenting new feature roadmap to stakeholders',
      roomId: 'room_client_001',
      hostId: charlie.id,
      status: 'completed',
      scheduledAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      startedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      endedAt: new Date(now.getTime() - 60 * 60 * 1000), // ended 1 hour ago
    },
  });

  console.log(`[v0] Created meetings: ${meeting1.title}, ${meeting2.title}, ${meeting3.title}\n`);

  // Add participants
  console.log('[v0] Adding participants...');

  await prisma.participant.createMany({
    data: [
      {
        id: 'participant_001',
        meetingId: meeting1.id,
        userId: alice.id,
        joinedAt: now,
        role: 'co-host',
      },
      {
        id: 'participant_002',
        meetingId: meeting1.id,
        userId: bob.id,
        joinedAt: new Date(now.getTime() + 5 * 60 * 1000),
        role: 'participant',
      },
      {
        id: 'participant_003',
        meetingId: meeting2.id,
        userId: bob.id,
        joinedAt: new Date(futureDate.getTime() + 10 * 60 * 1000),
        role: 'co-host',
      },
      {
        id: 'participant_004',
        meetingId: meeting2.id,
        userId: alice.id,
        joinedAt: new Date(futureDate.getTime() + 15 * 60 * 1000),
        role: 'participant',
      },
      {
        id: 'participant_005',
        meetingId: meeting3.id,
        userId: charlie.id,
        joinedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        role: 'co-host',
      },
      {
        id: 'participant_006',
        meetingId: meeting3.id,
        userId: alice.id,
        joinedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
        role: 'participant',
      },
    ],
  });

  console.log('[v0] Participants added\n');

  // Add co-host bookings
  console.log('[v0] Creating co-host bookings...');

  await prisma.coHostBooking.createMany({
    data: [
      {
        id: 'booking_001',
        meetingId: meeting1.id,
        userId: bob.id,
        status: 'approved',
      },
      {
        id: 'booking_002',
        meetingId: meeting2.id,
        userId: alice.id,
        status: 'pending',
      },
      {
        id: 'booking_003',
        meetingId: meeting3.id,
        userId: bob.id,
        status: 'approved',
      },
    ],
  });

  console.log('[v0] Co-host bookings created\n');

  // Add chat messages
  console.log('[v0] Adding chat messages...');

  await prisma.chatMessage.createMany({
    data: [
      {
        id: 'msg_001',
        meetingId: meeting1.id,
        userId: alice.id,
        content: 'Good morning everyone, let\'s start the standup',
        createdAt: now,
      },
      {
        id: 'msg_002',
        meetingId: meeting1.id,
        userId: bob.id,
        content: 'Hi Alice, ready to go!',
        createdAt: new Date(now.getTime() + 30 * 1000),
      },
      {
        id: 'msg_003',
        meetingId: meeting3.id,
        userId: charlie.id,
        content: 'Thank you all for attending today\'s presentation',
        createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      },
    ],
  });

  console.log('[v0] Chat messages added\n');

  // Summary
  console.log('[v0] Database seed completed successfully!');
  console.log(`\n[SUMMARY]`);
  console.log(`  Users: ${[alice, bob, charlie].length}`);
  console.log(`  Meetings: ${[meeting1, meeting2, meeting3].length}`);
  console.log(`  Test Credentials:`);
  console.log(`    Email: alice@example.com | Password: password123`);
  console.log(`    Email: bob@example.com | Password: password123`);
  console.log(`    Email: charlie@example.com | Password: password123`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('\n[v0] Seed script completed');
  })
  .catch(async (e) => {
    console.error('[ERROR]', e);
    await prisma.$disconnect();
    process.exit(1);
  });
