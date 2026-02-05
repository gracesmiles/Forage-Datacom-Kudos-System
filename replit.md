# KudosBoard

## Overview
KudosBoard is an internal recognition platform that allows team members to share appreciation and celebrate wins with their colleagues. The application uses Clerk for authentication and PostgreSQL (via Drizzle ORM) for data storage.

## Project Structure
- `client/` - React frontend with Vite
- `server/` - Express.js backend
- `shared/` - Shared types, schemas, and routes
- `script/` - Build scripts

## Tech Stack
- **Frontend**: React 18, Vite, TailwindCSS, Radix UI components
- **Backend**: Express.js 5, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk

## Environment Variables
Required secrets:
- `CLERK_SECRET_KEY` - Clerk secret key for backend
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk publishable key for frontend

Auto-configured:
- `DATABASE_URL` - PostgreSQL connection string

## Commands
- `npm run dev` - Start development server (port 5000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes

## Recent Changes
- February 5, 2026: Imported and configured for Replit environment
  - Changed server port to 5000
  - Added nanoid dependency
  - Created PostgreSQL database
  - Configured Clerk authentication secrets
