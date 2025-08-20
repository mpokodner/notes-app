# NextAuth.js Authentication Setup Guide

## Overview
This guide covers setting up NextAuth.js v4 with email-based magic link authentication for the NoteFlow app.

## ✅ What's Already Set Up

### 1. **NextAuth.js Configuration**
- Email provider with magic link authentication
- JWT strategy (no database sessions)
- Prisma adapter for database integration
- Custom pages for sign-in, sign-up, and verify request
- SessionProvider wrapper in root layout
- Middleware for route protection

### 2. **Database Schema**
- Updated Prisma schema with NextAuth.js tables:
  - `Account` - OAuth account information
  - `Session` - Session data (for database sessions, not used with JWT)
  - `User` - User information
  - `VerificationToken` - Email verification tokens
  - `Note` - User notes (existing)

### 3. **Authentication Pages**
- `/auth/signin` - Sign in with email
- `/auth/signup` - Sign up with email
- `/auth/verify-request` - Email verification page
- `/dashboard` - Protected dashboard (requires authentication)

### 4. **TypeScript Support**
- `types/next-auth.d.ts` - Type extensions for NextAuth
- Proper typing for session user with `id` field

## 🔧 Setup Steps

### 1. **Generate NEXTAUTH_SECRET**
```bash
# Generate a secure secret key
openssl rand -base64 32
# or use this online generator: https://generate-secret.vercel.app/32
```

### 2. **Configure Environment Variables**
Update your `.env` file with the following:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/noteflow?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-key-here"

# Email Configuration (Gmail example)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@noteflow.com"
```

### 3. **Set Up Gmail App Password**

#### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

#### Step 2: Generate App Password
1. Go to Security → 2-Step Verification
2. Scroll down to "App passwords"
3. Select "Mail" and "Other (Custom name)"
4. Enter "NoteFlow" as the name
5. Copy the generated 16-character password
6. Use this password as `EMAIL_SERVER_PASSWORD`

### 4. **Database Setup**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (if using db push)
npx prisma db push

# Or run migrations (if using migrations)
npm run db:migrate
```

### 5. **Start Development Server**
```bash
npm run dev
```

## 🚀 How It Works

### Authentication Flow
1. User visits `/auth/signup` or `/auth/signin`
2. Enters email (and name for signup)
3. NextAuth sends magic link email
4. User clicks link in email
5. NextAuth verifies token and creates/updates user
6. User is redirected to `/dashboard`

### Route Protection
- `/dashboard/*` routes are protected by middleware
- Unauthenticated users are redirected to `/auth/signin`
- All other routes remain public

### Session Management
- Uses JWT strategy (tokens stored in cookies)
- Session includes user `id`, `email`, `name`, and `image`
- SessionProvider wraps the entire app

## 🔍 Debugging

### Common Issues

#### 1. **Magic Link Not Working**
- Check email server configuration
- Verify `NEXTAUTH_URL` matches your domain
- Check spam folder
- Ensure `EMAIL_FROM` is properly configured

#### 2. **Database Connection Issues**
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check if database exists

#### 3. **TypeScript Errors**
- Run `npm run build` to check for type errors
- Ensure `types/next-auth.d.ts` is properly configured

#### 4. **Environment Variables**
- Verify all required env vars are set
- Check for typos in variable names
- Ensure no extra spaces or quotes

### Debug Commands
```bash
# Check Prisma schema
npx prisma validate

# View database in Prisma Studio
npm run db:studio

# Reset database
npm run db:reset

# Check build
npm run build
```

## 📁 File Structure

```
notes-app/
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # NextAuth API
│   ├── auth/
│   │   ├── signin/page.tsx              # Sign in page
│   │   ├── signup/page.tsx              # Sign up page
│   │   └── verify-request/page.tsx      # Email verification page
│   ├── dashboard/page.tsx               # Protected dashboard
│   └── layout.tsx                       # Root layout with SessionProvider
├── components/
│   ├── providers/SessionProvider.tsx    # NextAuth provider
│   └── ui/                              # shadcn/ui components
├── lib/
│   ├── prisma.ts                        # Prisma client
│   └── db.ts                            # Database utilities
├── types/
│   └── next-auth.d.ts                   # NextAuth type extensions
├── prisma/
│   └── schema.prisma                    # Database schema
├── middleware.ts                        # Route protection
└── .env                                 # Environment variables
```

## 🔒 Security Features

- JWT-based sessions (no database sessions)
- Email verification tokens
- Route protection with middleware
- Secure password handling
- CSRF protection (built into NextAuth)
- Rate limiting (can be added)

## 🎯 Next Steps

1. **Customize Email Templates**
   - NextAuth uses default templates
   - Can be customized in the provider configuration

2. **Add User Profile Management**
   - Profile update functionality
   - Avatar upload
   - Account settings

3. **Enhance Dashboard**
   - Note creation/editing
   - User statistics
   - Activity feed

4. **Add Additional Providers**
   - Google OAuth
   - GitHub OAuth
   - Custom providers

## 📚 Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Next.js App Router](https://nextjs.org/docs/app)
