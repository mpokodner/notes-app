# Database Setup for NoteFlow

## Prerequisites
- PostgreSQL installed and running
- Node.js and npm

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database
1. Create a PostgreSQL database named `noteflow`
2. Update the `.env` file with your database credentials:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/noteflow?schema=public"
   ```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Run Database Migrations
```bash
npx prisma migrate dev --name init
```

### 5. (Optional) Seed Database
```bash
npx prisma db seed
```

## Database Schema

### Users Table
- `id` - Unique identifier (CUID)
- `email` - User email (unique)
- `name` - User name (optional)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Notes Table
- `id` - Unique identifier (CUID)
- `title` - Note title
- `content` - Note content (optional)
- `isArchived` - Archive status
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp
- `userId` - Foreign key to users table

## Useful Commands

- View database in Prisma Studio: `npx prisma studio`
- Reset database: `npx prisma migrate reset`
- View migrations: `npx prisma migrate status`
