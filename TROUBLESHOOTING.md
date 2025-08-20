# Troubleshooting Guide: 500 Error on /api/auth/email

## Quick Diagnosis

### 1. Check Environment Variables

Run this command to verify all required environment variables are set:

```bash
npm run test:email
```

### 2. Check Database Connection

```bash
npm run db:studio
```

### 3. Check Build Logs

```bash
npm run build
```

## Common Issues and Solutions

### Issue 1: Missing Environment Variables

**Error**: `Missing required environment variables`
**Solution**:

1. Create `.env.local` file with all required variables
2. For Vercel: Add variables in Vercel dashboard
3. Restart development server

**Required Variables**:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@noteflow.com"
```

### Issue 2: Gmail Authentication Failed

**Error**: `Invalid login` or `Authentication failed`
**Solution**:

1. Enable 2-Factor Authentication on Google account
2. Generate app password (not your main password)
3. Use app password as `EMAIL_SERVER_PASSWORD`

**Steps**:

1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App passwords
4. Select "Mail" and "Other (Custom name)"
5. Enter "NoteFlow" as name
6. Copy the 16-character password

### Issue 3: Database Connection Failed

**Error**: `Database connection failed`
**Solution**:

1. Verify `DATABASE_URL` is correct
2. Ensure database is running
3. Check database permissions
4. Run migrations: `npm run db:migrate`

### Issue 4: Prisma Client Not Generated

**Error**: `PrismaClientInitializationError`
**Solution**:

1. Run: `npm run db:generate`
2. Ensure build script includes: `prisma generate && next build`
3. Check `postinstall` script runs: `prisma generate`

### Issue 5: Email Server Connection Timeout

**Error**: `Connection timeout` or `ECONNECTION`
**Solution**:

1. Verify `EMAIL_SERVER_HOST` is `smtp.gmail.com`
2. Verify `EMAIL_SERVER_PORT` is `587`
3. Check firewall settings
4. Try different network

### Issue 6: TLS/SSL Issues

**Error**: `TLS handshake failed`
**Solution**:

- Configuration already includes `rejectUnauthorized: false`
- Check if your network blocks SMTP traffic
- Try using port 465 with `secure: true`

### Issue 7: Vercel Deployment Issues

**Error**: Environment variables not found in production
**Solution**:

1. Add all environment variables in Vercel dashboard
2. Ensure `NEXTAUTH_URL` is your production domain
3. Redeploy after adding variables

## Debug Steps

### Step 1: Enable Debug Mode

```env
NODE_ENV=development
```

### Step 2: Check Console Logs

Look for these log messages:

- "Sending verification email to: [email]"
- "Email sent successfully: [messageId]"
- "New user created: [email]"
- "User signed in: [email]"

### Step 3: Test Email Configuration

```bash
npm run test:email
```

### Step 4: Check Database Tables

```bash
npm run db:studio
```

Verify these tables exist:

- `users`
- `accounts`
- `sessions`
- `verification_tokens`
- `notes`

### Step 5: Test NextAuth Endpoint

```bash
curl -X POST http://localhost:3000/api/auth/signin/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## Production Deployment Checklist

### Vercel Environment Variables

- [ ] `DATABASE_URL` - Production database URL
- [ ] `NEXTAUTH_URL` - Your production domain (https://...)
- [ ] `NEXTAUTH_SECRET` - Secure random string
- [ ] `EMAIL_SERVER_HOST` - `smtp.gmail.com`
- [ ] `EMAIL_SERVER_PORT` - `587`
- [ ] `EMAIL_SERVER_USER` - Your Gmail address
- [ ] `EMAIL_SERVER_PASSWORD` - Gmail app password
- [ ] `EMAIL_FROM` - `noreply@noteflow.com`

### Database Setup

- [ ] Production database created
- [ ] Database accessible from Vercel
- [ ] Prisma migrations run
- [ ] Tables created successfully

### Email Configuration

- [ ] Gmail 2FA enabled
- [ ] App password generated
- [ ] Email test successful
- [ ] Magic link emails received

## Testing the Fix

### 1. Local Testing

```bash
npm run dev
# Go to /auth/signup
# Enter your email
# Check console logs
# Check email inbox
```

### 2. Production Testing

1. Deploy to Vercel
2. Go to your production domain
3. Test sign-up flow
4. Check Vercel function logs
5. Verify email received

## Emergency Fixes

### If Nothing Works

1. **Reset everything**:

   ```bash
   npm run db:reset
   npm run db:generate
   npm run build
   ```

2. **Use different email provider**:

   - Try SendGrid
   - Try Resend
   - Try AWS SES

3. **Check Vercel logs**:
   - Go to Vercel dashboard
   - Check function logs
   - Look for specific error messages

## Support

If you're still having issues:

1. Check the console logs for specific error messages
2. Verify all environment variables are set correctly
3. Test email configuration with the test script
4. Check database connection and tables
5. Ensure Gmail app password is correct

The most common cause is incorrect Gmail app password or missing environment variables in production.
