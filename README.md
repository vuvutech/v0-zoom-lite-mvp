# ZoomLite MVP - Modern Video Conferencing Platform

A lightweight, fast, and intuitive video conferencing application built with Next.js 16, MongoDB, Prisma, better-auth, and WebRTC.

## Features

### Core Features
- **User Authentication** - Secure email/password signup and signin with better-auth
- **Meeting Management** - Create, schedule, and manage video meetings
- **Real-time Video/Audio** - WebRTC peer-to-peer video and audio calling
- **Real-time Chat** - Socket.io-powered instant messaging during meetings
- **Meeting Dashboard** - View all your meetings at a glance

### Advanced Features
- **Participant Management** - Track who's in the meeting and their status
- **Co-host Bookings** - Request and approve co-host roles
- **Screen Sharing** - Share your screen with participants (infrastructure ready)
- **Meeting Recording** - Record meetings for later review
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: shadcn/ui + Tailwind CSS v4
- **Real-time**: Socket.io Client
- **WebRTC**: Native browser APIs
- **State Management**: SWR + React Hooks
- **Authentication**: better-auth client

### Backend
- **Runtime**: Next.js 16 API Routes
- **Database**: MongoDB with Prisma ORM
- **Authentication**: better-auth
- **Real-time**: Socket.io Server
- **Validation**: Zod

### DevOps
- **Deployment**: Vercel (recommended)
- **Hosting**: MongoDB Atlas
- **SSL/TLS**: Automatic with Vercel

## Project Structure

\`\`\`
zoomlite/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── meetings/             # Meeting CRUD endpoints
│   │   ├── bookings/             # Co-host booking endpoints
│   │   └── socket/               # Socket.io handler
│   ├── page.tsx                  # Home page
│   ├── signin/                   # Sign in page
│   ├── signup/                   # Sign up page
│   ├── dashboard/                # Main dashboard
│   ├── meeting/                  # Meeting room page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── auth-form.tsx             # Auth form component
│   ├── meeting-room.tsx          # Meeting room layout
│   ├── video-container.tsx       # Video player component
│   ├── meeting-chat.tsx          # Chat component
│   ├── participant-list.tsx      # Participant list
│   ├── screen-share.tsx          # Screen sharing
│   └── ...
├── hooks/                        # Custom React hooks
│   ├── use-socket.ts             # Socket.io connection
│   ├── use-peer-connection.ts    # WebRTC peer connection
│   └── use-mobile.ts             # Mobile detection
├── lib/                          # Utility functions
│   ├── auth.ts                   # better-auth configuration
│   ├── auth-client.ts            # better-auth client setup
│   ├── prisma.ts                 # Prisma singleton
│   ├── webrtc.ts                 # WebRTC utilities
│   ├── recording.ts              # Recording utilities
│   ├── socket-io.ts              # Socket.io client setup
│   └── utils.ts                  # General utilities
├── middleware.ts                 # Next.js middleware
├── prisma/                       # Prisma ORM
│   └── schema.prisma             # Database schema
├── public/                       # Static assets
├── scripts/                      # Utility scripts
│   ├── seed.ts                   # Database seeding
│   └── test-api.ts               # API testing
├── .env.example                  # Environment template
├── SETUP.md                      # Setup guide
├── API_TESTING.md                # API documentation
├── DATABASE_SETUP.md             # Database guide
└── README.md                     # This file
\`\`\`

## Quick Start

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
- npm or pnpm installed

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd zoomlite
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
# or
pnpm install
\`\`\`

3. **Setup environment variables**
\`\`\`bash
cp .env.example .env.local
\`\`\`

Update `.env.local` with your credentials:
- `DATABASE_URL`: Your MongoDB connection string
- `BETTER_AUTH_SECRET`: A 32+ character random string
- `BETTER_AUTH_URL`: http://localhost:3000 (development)

4. **Initialize database**
\`\`\`bash
npm run prisma:db:push
\`\`\`

5. **Seed sample data (optional)**
\`\`\`bash
npm run seed
\`\`\`

6. **Start development server**
\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000 to see the application.

## Usage

### Creating an Account

1. Navigate to http://localhost:3000/signup
2. Enter your name, email, and password
3. Click "Create Account"
4. You'll be redirected to the dashboard

### Creating a Meeting

1. From the dashboard, fill in:
   - Meeting Title (required)
   - Description (optional)
   - Start Time (required)
2. Click "Create Meeting"
3. You'll enter the meeting room

### Joining a Meeting

1. From the dashboard, click "Join" on any meeting
2. Allow camera/microphone permissions
3. Start video/audio and chat

### Testing with Multiple Participants

1. Open two browser windows
2. Sign in with different accounts
3. One user creates a meeting
4. The other user joins from their dashboard
5. Test audio/video and chat

## API Endpoints

See [API_TESTING.md](./API_TESTING.md) for comprehensive API documentation.

### Key Endpoints

**Authentication**
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signout` - Sign out user

**Meetings**
- `GET /api/meetings` - Get all user meetings
- `POST /api/meetings` - Create meeting
- `GET /api/meetings/:id` - Get meeting details
- `PUT /api/meetings/:id` - Update meeting
- `DELETE /api/meetings/:id` - Delete meeting

**Bookings**
- `GET /api/bookings` - Get booking requests
- `POST /api/bookings/:id/approve` - Approve booking

**WebSocket Events**
- `join` - User joins meeting
- `leave` - User leaves meeting
- `offer` - WebRTC offer
- `answer` - WebRTC answer
- `ice-candidate` - ICE candidate
- `message` - Chat message

## Configuration

### Environment Variables

See `.env.example` for all available variables. Key variables:

- `DATABASE_URL` - MongoDB connection string
- `BETTER_AUTH_SECRET` - Authentication secret (32+ chars)
- `BETTER_AUTH_URL` - Application URL
- `AUTH_SECRET` - Session secret

### Database Schema

The Prisma schema includes:

- **User** - User accounts and profiles
- **Account** - OAuth provider accounts
- **Session** - Active sessions
- **Meeting** - Meeting metadata and scheduling
- **Participant** - Meeting participants
- **CoHostBooking** - Co-host approval workflow
- **ChatMessage** - Real-time chat messages

See `prisma/schema.prisma` for complete schema.

## Development

### Available Scripts

\`\`\`bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run prisma:generate  # Generate Prisma client
npm run prisma:db:push   # Push schema to DB
npm run prisma:studio    # Open Prisma Studio
npm run seed             # Seed database
\`\`\`

### Testing

Run API tests:
\`\`\`bash
npm run test:api
\`\`\`

See [API_TESTING.md](./API_TESTING.md) for manual testing guide.

### Database Management

View database contents:
\`\`\`bash
npm run prisma:studio
\`\`\`

Opens Prisma Studio at http://localhost:5555

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `AUTH_SECRET`
4. Deploy

### Environment Setup for Production

1. Use a production MongoDB cluster
2. Set strong secrets (32+ characters)
3. Update `BETTER_AUTH_URL` to your domain
4. Enable SSL/TLS (automatic on Vercel)

## Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Verify connection string in `.env.local`
- Check IP whitelist in MongoDB Atlas
- Ensure database name is "zoomlite"

**WebRTC Not Working**
- Check browser console for errors
- Verify microphone/camera permissions
- Ensure both users are in same meeting room

**Authentication Issues**
- Check `BETTER_AUTH_SECRET` is set correctly
- Verify `BETTER_AUTH_URL` matches your domain
- Clear browser cookies and retry

See [SETUP.md](./SETUP.md) and [DATABASE_SETUP.md](./DATABASE_SETUP.md) for more troubleshooting.

## Performance Optimization

### Frontend
- Server-side rendering with Next.js
- Static generation where possible
- Image optimization with next/image
- CSS-in-JS with Tailwind CSS

### Backend
- Database indexes on frequently queried fields
- Connection pooling with Prisma
- Socket.io rooms for scalability
- API rate limiting (implement as needed)

### WebRTC
- STUN servers for NAT traversal
- Bandwidth-optimized video codecs
- Peer connection connection pooling

## Security

### Best Practices

- **Authentication**: Email/password with bcrypt hashing via better-auth
- **Authorization**: Row-level security checks on API endpoints
- **Encryption**: HTTPS/TLS for all connections
- **Data Validation**: Zod schema validation on all inputs
- **Session Management**: Secure session tokens in HTTP-only cookies
- **CORS**: Configured for development/production

### Environment Variables

Never commit `.env.local` to version control. Use `.env.example` as template.

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## Roadmap

- [ ] End-to-end encryption for messages
- [ ] Meeting transcription with AI
- [ ] Advanced recording options
- [ ] Meeting analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Virtual backgrounds
- [ ] Live streaming support

## Support

For issues, questions, or suggestions:
1. Check existing issues and documentation
2. Open a GitHub issue with detailed description
3. Contact support via email

## License

MIT License - see LICENSE file for details

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - ORM
- [better-auth](https://www.better-auth.com/) - Authentication
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Socket.io](https://socket.io/) - Real-time communication

---

Built with by the ZoomLite Team. Happy conferencing!
