<div align="center">

**🌐 Live at [devlog-sand.vercel.app](https://devlog-sand.vercel.app)**

# 🚀 DevLog

**A social platform built for developers.**  
Post logs, share progress, follow other devs, and showcase your GitHub — all in one place.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[Features](#features) · [Getting Started](#getting-started) · [Project Structure](#project-structure) · [API Reference](#api-reference)

</div>

---

## Features

| | Feature | Description |
|---|---|---|
| 👤 | **Developer Profiles** | Public profiles with bio, social links, and GitHub integration |
| 🐙 | **GitHub Integration** | Link your GitHub to display your avatar and top repositories |
| 📝 | **Logs** | Short-form dev updates — public (visible to all) or private (only you) |
| ❤️ | **Likes & Comments** | Like and comment on public logs, with threaded reply support |
| 👥 | **Follow System** | Follow devs and get a personalized feed of their public logs |
| 🔍 | **Explore** | Discover developers, public logs, and trending GitHub repositories |
| 🔐 | **Auth** | Sign in with Google or email/password |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials _(optional, for Google sign-in)_

### 1. Clone the repository

```bash
git clone https://github.com/your-username/devlog.git
cd devlog
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/devlog"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Run database migrations

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
app/
├── api/
│   ├── auth/[...nextauth]/     # NextAuth config (Google + Credentials)
│   ├── feed/                   # Following feed
│   ├── follow/                 # Follow / unfollow
│   ├── logs/                   # Log CRUD
│   │   └── [logId]/
│   │       ├── comments/       # Threaded comments
│   │       └── like/           # Like toggle + status
│   ├── me/                     # Current user
│   ├── profile/                # Profile updates
│   └── search/                 # Explore search
├── dashboard/                  # Private dashboard
├── explore/                    # Discover page
├── feed/                       # Following feed page
├── u/
│   └── [username]/             # Public profile
│       └── [logId]/            # Log detail (likes + comments)
└── lib/
    └── prisma.ts               # Prisma client singleton
```

---

## Key Pages

| Route | Description |
|---|---|
| `/dashboard` | Your private dashboard — manage profile, write logs, view repos |
| `/explore` | Discover developers, logs, and trending GitHub repos |
| `/feed` | Personalized feed from developers you follow |
| `/u/[username]` | Any developer's public profile |
| `/u/[username]/[logId]` | Individual log with likes and threaded comments |

---

## API Reference

### User

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/me` | ✅ | Get current user's profile |
| `POST` | `/api/profile` | ✅ | Update current user's profile |

### Logs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/logs` | ✅ | Get all logs for current user |
| `POST` | `/api/logs` | ✅ | Create a new log |
| `DELETE` | `/api/logs` | ✅ | Delete a log |
| `GET` | `/api/logs/[logId]` | ❌ | Get a single public log |

### Comments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/logs/[logId]/comments` | ❌ | Get comments for a log |
| `POST` | `/api/logs/[logId]/comments` | ✅ | Post a comment or reply |
| `DELETE` | `/api/logs/[logId]/comments` | ✅ | Delete your comment |

### Likes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/logs/[logId]/like` | ✅ | Toggle like on a log |
| `GET` | `/api/logs/[logId]/like/status` | ✅ | Check if you liked a log |

### Follow

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/follow` | ✅ | Follow or unfollow a user |
| `GET` | `/api/follow?username=x` | ✅ | Check if you follow a user |

### Feed & Search

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/feed` | ✅ | Public logs from followed users |
| `GET` | `/api/search?q=query` | ❌ | Search users, logs, and GitHub repos |

---

## Database Schema

```prisma
model User    { id, email, username, bio, githubUsername, socialLinks... }
model Log     { id, title, content, isPublic, userId }
model Comment { id, content, authorId, logId, parentId }
model Like    { userId, logId }
model Follow  { followerId, followingId }
```

---

## Deployment

The easiest way to deploy is with [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repo on Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy 🚀

> DevLog is live at [https://devlog-sand.vercel.app](https://devlog-sand.vercel.app)

---

