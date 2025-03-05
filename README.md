
# Solo0 Project

This is a full-stack application with a React frontend and Express backend.

## Project Structure

- `/client` - React frontend
- `/server` - Express backend
- `/shared` - Shared TypeScript types/schemas

## Deployment Instructions

### Prerequisites

- Node.js (v16+)
- PostgreSQL database

### Local Development

1. Install dependencies:
```
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory with:
```
DATABASE_URL=your_postgres_connection_string
```

3. Run development server:
```
npm run dev
```

### Deployment on Vercel

This project is configured for Vercel deployment. You can deploy directly using:

```
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Deployment on Other Platforms

#### Frontend

1. Build the frontend:
```
npm run build
```

2. The built files will be in `dist/public`.

#### Backend

1. The server is built using the build script in package.json.
2. The main entry point is `server/index.ts` (built to `dist/index.js`).
3. Make sure to set the DATABASE_URL environment variable.

## Database

The project uses PostgreSQL with Drizzle ORM. Run migrations with:

```
npm run db:push
```
