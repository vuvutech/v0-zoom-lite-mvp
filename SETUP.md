# ZoomLite MVP - Setup Guide

Welcome to ZoomLite! This guide will help you get the development environment up and running.

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier available)
- Git

## Environment Setup

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd zoomlite-mvp
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
pnpm install
\`\`\`

### 3. Configure Environment Variables

#### Create `.env.local` file

Copy `.env.example` to `.env.local`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

#### Setup MongoDB

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Click "Connect" and select "Drivers"
5. Copy the connection string
6. Replace `username` and `password` with your credentials
7. Paste into `DATABASE_URL` in `.env.local`

#### Generate Auth Secrets

Generate a secure random string for `BETTER_AUTH_SECRET`:

**On macOS/Linux:**
\`\`\`bash
openssl rand -hex 32
\`\`\`

**On Windows (PowerShell):**
\`\`\`powershell
[System.Convert]::ToHexString((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
\`\`\`

Update both secrets in `.env.local`.

### 4. Initialize the Database

Push the Prisma schema to MongoDB:

\`\`\`bash
npm run prisma:db:push
\`\`\`

This will create all required collections automatically.

### 5. Start the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing the Application

### Sign Up

1. Navigate to [http://localhost:3000/signup](http://localhost:3000/signup)
2. Enter your email, name, and password
3. Click "Create Account"
4. You should be redirected to the dashboard

### Create a Meeting

1. From the dashboard, fill in the meeting details:
   - Meeting Title (required)
   - Description (optional)
   - Start Time (required)
2. Click "Create Meeting"
3. You'll be taken to the meeting room

### Test WebRTC

1. Open two browser windows and sign in with different accounts
2. One user creates a meeting
3. The other user joins the same meeting
4. Test audio/video by clicking the mic and camera buttons

### Test Real-time Chat

Use the chat panel on the right side of the meeting room to send messages between participants.

## Available Scripts

| Command | Purpose |
|---------|---------|
| \`npm run dev\` | Start development server |
| \`npm run build\` | Build for production |
| \`npm run start\` | Start production server |
| \`npm run lint\` | Run ESLint |
| \`npm run prisma:generate\` | Generate Prisma client |
| \`npm run prisma:db:push\` | Push schema changes to DB |
| \`npm run prisma:studio\` | Open Prisma Studio |

## API Endpoints

### Authentication
- \`POST /api/auth/signup\` - Register new user
- \`POST /api/auth/signin\` - Sign in user
- \`POST /api/auth/signout\` - Sign out user

### Meetings
- \`GET /api/meetings\` - Get all user's meetings
- \`POST /api/meetings\` - Create new meeting
- \`GET /api/meetings/:id\` - Get meeting details
- \`PUT /api/meetings/:id\` - Update meeting
- \`DELETE /api/meetings/:id\` - Delete meeting

### Bookings
- \`GET /api/bookings\` - Get co-host booking requests
- \`POST /api/bookings/:id/approve\` - Approve booking

## Troubleshooting

### MongoDB Connection Error

**Problem:** \`MongoNetworkError\`

**Solution:**
1. Verify connection string in `.env.local`
2. Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for development)
3. Ensure database name is "zoomlite"

### Prisma Schema Error

**Problem:** \`PrismaClientValidationError\`

**Solution:**
\`\`\`bash
npm run prisma:generate
npm run prisma:db:push
\`\`\`

### WebRTC Connection Issues

**Problem:** Video/audio not working

**Solution:**
1. Check browser console for errors
2. Verify microphone/camera permissions
3. Both participants must be in the same meeting room

### Port Already in Use

**Problem:** \`Error: listen EADDRINUSE: address already in use :::3000\`

**Solution:**
\`\`\`bash
# Find process on port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
\`\`\`

## Deployment

### To Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - \`DATABASE_URL\`
   - \`BETTER_AUTH_SECRET\`
   - \`AUTH_SECRET\`
4. Deploy

### To Other Platforms

Ensure these environment variables are set on your hosting platform before deploying.

## Support

For issues or questions, please open a GitHub issue or check the documentation.
