# ZoomLite API Testing Guide

Test the ZoomLite API endpoints using curl, Postman, or any HTTP client.

## Base URL

\`\`\`
http://localhost:3000
\`\`\`

## Authentication

Most endpoints require authentication. Cookies are automatically managed by the browser.

## Endpoints

### 1. Sign Up

**Endpoint:** \`POST /api/auth/[...all]\`

**Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "secure_password_123",
  "name": "John Doe"
}
\`\`\`

**Response:**
\`\`\`json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "token": "session_token"
  }
}
\`\`\`

### 2. Get All Meetings

**Endpoint:** \`GET /api/meetings\`

**Response:**
\`\`\`json
[
  {
    "id": "meeting_id",
    "title": "Team Standup",
    "description": "Weekly team sync",
    "roomId": "room_unique_id",
    "hostId": "host_user_id",
    "status": "scheduled",
    "start_time": "2025-01-20T10:00:00Z",
    "createdAt": "2025-01-17T15:30:00Z"
  }
]
\`\`\`

### 3. Create Meeting

**Endpoint:** \`POST /api/meetings\`

**Body:**
\`\`\`json
{
  "title": "Project Planning",
  "description": "Q1 project roadmap discussion",
  "startTime": "2025-01-25T14:00:00Z"
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "new_meeting_id",
  "title": "Project Planning",
  "roomId": "unique_room_id",
  "status": "scheduled"
}
\`\`\`

### 4. Get Meeting Details

**Endpoint:** \`GET /api/meetings/:id\`

**Response:**
\`\`\`json
{
  "id": "meeting_id",
  "title": "Project Planning",
  "description": "Q1 project roadmap discussion",
  "roomId": "unique_room_id",
  "hostId": "host_user_id",
  "status": "scheduled",
  "start_time": "2025-01-25T14:00:00Z",
  "participants": [
    {
      "id": "participant_id",
      "userId": "user_id",
      "joinedAt": "2025-01-25T14:00:30Z",
      "role": "participant"
    }
  ]
}
\`\`\`

### 5. Update Meeting

**Endpoint:** \`PUT /api/meetings/:id\`

**Body:**
\`\`\`json
{
  "title": "Updated Title",
  "description": "Updated description"
}
\`\`\`

### 6. Delete Meeting

**Endpoint:** \`DELETE /api/meetings/:id\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Meeting deleted"
}
\`\`\`

### 7. Get Co-Host Bookings

**Endpoint:** \`GET /api/bookings\`

**Response:**
\`\`\`json
[
  {
    "id": "booking_id",
    "meetingId": "meeting_id",
    "userId": "user_id",
    "status": "pending",
    "createdAt": "2025-01-17T15:30:00Z"
  }
]
\`\`\`

### 8. Approve Booking

**Endpoint:** \`POST /api/bookings/:id/approve\`

**Body:**
\`\`\`json
{
  "approved": true
}
\`\`\`

## Testing with cURL

### Sign Up
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/signup \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "test_password_123",
    "name": "Test User"
  }'
\`\`\`

### Create Meeting
\`\`\`bash
curl -X POST http://localhost:3000/api/meetings \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Test Meeting",
    "description": "Testing the API",
    "startTime": "2025-01-25T10:00:00Z"
  }'
\`\`\`

### Get Meetings
\`\`\`bash
curl -X GET http://localhost:3000/api/meetings
\`\`\`

## Testing with Postman

1. Import the collection from \`postman_collection.json\`
2. Set the base URL to \`http://localhost:3000\`
3. Authentication is handled automatically through cookies
4. Run requests individually or as a collection

## Common Issues

### 401 Unauthorized

**Cause:** User not authenticated

**Solution:** Sign up or sign in first

### 403 Forbidden

**Cause:** User doesn't have permission

**Solution:** Only hosts can modify their own meetings

### 404 Not Found

**Cause:** Meeting/resource doesn't exist

**Solution:** Verify the meeting ID is correct

### 500 Internal Server Error

**Cause:** Server error

**Solution:** Check server console logs and MongoDB connection
