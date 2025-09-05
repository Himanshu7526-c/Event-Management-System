# git add README.md

A full-stack Event Management System built with **React**, **Node.js**, **Express**, and **MongoDB**. Users can login with a code, view ongoing and past events, add and update events with media (photos/videos), and track event activities.

## Features

- **User Authentication**
  - Login with a 4-digit code
  - Cookie-based authentication with JWT
  - Session check on app load
  - Logout

- **Event Management**
  - Create new events with:
    - Name, location, date/time, attendees count
    - Photos (max 10)
    - Media coverage photos (max 5)
    - Video (min 10MB)
  - Update event details and media
  - View event details
  - Track event activity per user (viewed/updated)

- **Event Listing**
  - Ongoing events
  - Previous events
  - Sorted by start date/time

- **Admin Dashboard**
  - Optional: Add admin routes for report generation

## Tech Stack

- **Frontend:** React, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT with cookies
- **File Upload:** Multer

## Folder Structure

```
backend/
├─ models/
│  ├─ User.js
│  ├─ Event.js
│  └─ EventActivity.js
├─ routes/
│  ├─ auth.js
│  ├─ events.js
│  └─ admin.js
├─ middleware/
│  ├─ authMiddleware.js
│  └─ uploadMiddleware.js
├─ config/
│  └─ db.js
├─ server.js
frontend/
├─ src/
│  ├─ pages/
│  │  ├─ Login.jsx
│  │  ├─ AddEvent.jsx
│  │  ├─ UpdateEvent.jsx
│  │  └─ EventDetails.jsx
│  ├─ components/
│  │  ├─ Navbar.jsx
│  │  └─ ProtectedRoute.jsx
│  ├─ context/
│  │  └─ AuthContext.jsx
│  ├─ api/
│  │  └─ axios.js
│  └─ App.jsx
```

## Setup & Installation

### Backend

1. Clone the repo and install dependencies:

```bash
cd backend
npm install
```

2. Create `.env` file with:

```
MONGO_URI=<Your MongoDB URI>
JWT_SECRET=<Your JWT Secret>
PORT=5000
```

3. Start backend server:

```bash
npm run dev
```

### Frontend

1. Navigate to frontend and install dependencies:

```bash
cd frontend
npm install
```

2. Start frontend:

```bash
npm run dev
```

3. Open `http://localhost:5173` in browser.

## Usage

1. Login using a 4-digit code.
2. View ongoing and past events.
3. Add a new event with photos and video.
4. Update existing events.
5. Track user activity on events.

## Notes

- For production, enable HTTPS and set `secure: true` in cookies.
- Video uploads must be at least 10 MB.
- Max 10 photos and 5 media coverage photos per event.


