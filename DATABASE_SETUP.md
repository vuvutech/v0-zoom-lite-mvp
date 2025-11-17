# ZoomLite Database Setup Guide

This guide covers setting up MongoDB with Prisma for ZoomLite.

## Overview

ZoomLite uses:
- **Database**: MongoDB (Atlas recommended for development)
- **ORM**: Prisma
- **Auth**: better-auth

## MongoDB Setup

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new project
4. Click "Build a Cluster"
5. Choose the free tier (M0)
6. Select a region close to you
7. Click "Create Cluster"

### Getting Connection String

1. In Atlas, go to "Clusters" → "Connect"
2. Click "Drivers"
3. Select "Node.js" as the driver
4. Copy the connection string
5. Replace `<username>` and `<password>` with your database credentials
6. Make sure the database name is "zoomlite"

**Format:**
\`\`\`
mongodb+srv://username:password@cluster.mongodb.net/zoomlite?retryWrites=true&w=majority
\`\`\`

### Network Access

1. Go to "Security" → "Network Access"
2. Click "Add IP Address"
3. For development, add 0.0.0.0/0 (allows all IPs)
4. For production, add your specific IP

## Prisma Setup

### Generate Prisma Client

\`\`\`bash
npm run prisma:generate
\`\`\`

### Push Schema to Database

\`\`\`bash
npm run prisma:db:push
\`\`\`

This creates all necessary collections:
- users
- accounts (for OAuth providers)
- sessions (for authentication)
- verifications (for email verification)
- meetings
- participants
- cohost_bookings
- chat_messages

### View Database Contents

\`\`\`bash
npm run prisma:studio
\`\`\`

Opens Prisma Studio at http://localhost:5555

## Seeding Data

### Load Sample Data

\`\`\`bash
npm run seed
\`\`\`

This creates:
- 3 sample users (Alice, Bob, Charlie)
- 3 sample meetings
- Participants and chat messages
- Co-host booking requests

### Default Test Credentials

\`\`\`
Email: alice@example.com
Password: password123

Email: bob@example.com
Password: password123

Email: charlie@example.com
Password: password123
\`\`\`

## Schema Overview

### Users
- Stores user authentication and profile data
- Linked to accounts (OAuth) and sessions

### Meetings
- Meeting metadata (title, description, times)
- References host (User) and participants
- Status tracking (scheduled, in_progress, completed)

### Participants
- Join records for each user in a meeting
- Tracks join time, role (participant/co-host)

### CoHostBooking
- Approval workflow for co-host requests
- Status: pending, approved, rejected

### ChatMessage
- Real-time messages during meetings
- Indexed by meetingId and createdAt for efficient queries

## Migrations

### Create Migration

\`\`\`bash
npx prisma migrate dev --name migration_name
\`\`\`

### Reset Database

\`\`\`bash
npx prisma migrate reset
\`\`\`

**Warning:** This deletes all data and recreates the schema.

### Production Deployment

For production, use:

\`\`\`bash
npx prisma migrate deploy
\`\`\`

## Troubleshooting

### Connection Issues

**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solution:**
1. Verify DATABASE_URL in .env.local
2. Check MongoDB is running (if local)
3. Check IP whitelist if using Atlas
4. Test connection: `npx prisma db execute --stdin < test.sql`

### Schema Issues

**Error:** `PrismaClientValidationError`

**Solution:**
\`\`\`bash
npm run prisma:generate
npm run prisma:db:push
\`\`\`

### Collections Not Created

**Error:** Collections don't appear in MongoDB

**Solution:**
\`\`\`bash
npx prisma db push --force-reset
npm run seed
\`\`\`

## Performance Optimization

### Add Indexes

Prisma automatically creates indexes for:
- Foreign keys
- @unique fields
- @relation fields

### Query Optimization

For large collections, consider adding indexes in Prisma schema:

\`\`\`prisma
model Meeting {
  // ...
  @@index([hostId])
  @@index([status])
  @@index([createdAt])
}
\`\`\`

## Backup & Restore

### MongoDB Atlas Backup

1. Go to "Backup" in your cluster
2. Click "Take Backup Now"
3. To restore, click "Restore" on a backup

### Manual Export

\`\`\`bash
# Export collection to JSON
mongoexport --uri="mongodb+srv://..." --collection=meetings --out=meetings.json

# Import collection from JSON
mongoimport --uri="mongodb+srv://..." --collection=meetings --file=meetings.json
\`\`\`

## Security Best Practices

1. Keep DATABASE_URL private (never commit to git)
2. Use strong passwords for MongoDB
3. Enable IP whitelist in production
4. Enable audit logs in Atlas
5. Use MongoDB encryption at rest (enterprise feature)
6. Regularly backup your data

## Reference

- [Prisma Documentation](https://www.prisma.io/docs/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Prisma MongoDB Guide](https://www.prisma.io/docs/orm/overview/databases/mongodb)
