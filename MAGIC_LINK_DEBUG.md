# Magic Link Authentication Debugging Guide

## Current Status ✅
- ✅ NextAuth configuration is correct
- ✅ Database connection is working
- ✅ All required tables exist
- ✅ Environment variables are properly set
- ✅ Email configuration is working
- ✅ NextAuth API endpoints are accessible

## Common Issues and Solutions

### 1. Magic Link Redirects to Sign-in Page Instead of Logging In

**Symptoms:**
- User receives magic link email
- Clicking the link redirects to `/auth/signin` instead of `/dashboard`
- User is not logged in

**Possible Causes:**
1. **Expired or Invalid Token**: Magic links expire after 24 hours by default
2. **Already Used Token**: Magic links can only be used once
3. **Incorrect NEXTAUTH_URL**: Environment variable doesn't match the actual URL
4. **Middleware Interference**: Middleware blocking the callback URL

**Solutions:**
1. **Check NEXTAUTH_URL**: Ensure it matches your actual domain
   ```bash
   # For local development
   NEXTAUTH_URL=http://localhost:3000
   
   # For production
   NEXTAUTH_URL=https://yourdomain.com
   ```

2. **Request a New Magic Link**: Old links may be expired
3. **Check Browser Console**: Look for any JavaScript errors
4. **Verify Callback URL**: Ensure the magic link URL is correct

### 2. 500 Internal Server Error on /api/auth/signin/email

**Symptoms:**
- Form submission fails with 500 error
- No email is sent
- Server logs show errors

**Solutions:**
1. **Check Email Configuration**: Verify SMTP settings
2. **Database Connection**: Ensure database is accessible
3. **Environment Variables**: Verify all required vars are set
4. **NextAuth Secret**: Ensure NEXTAUTH_SECRET is properly set

### 3. Magic Link Email Not Received

**Symptoms:**
- Form submission succeeds
- No email in inbox (check spam folder)
- No error message

**Solutions:**
1. **Check Spam Folder**: Magic link emails often go to spam
2. **Verify Email Address**: Ensure correct email is entered
3. **Check SMTP Configuration**: Test email sending
4. **Check Email Provider Limits**: Gmail has daily sending limits

## Testing Steps

### 1. Test Email Configuration
```bash
npm run test:email
```

### 2. Test NextAuth Configuration
```bash
npm run test:auth
```

### 3. Test Magic Link Flow
1. Visit: `http://localhost:3000/auth/signin`
2. Enter your email address
3. Check email for magic link
4. Click the magic link
5. Should redirect to `/dashboard`

### 4. Check Server Logs
Look for these log messages:
- "Sending verification email to: [email]"
- "User signed in: [email]"
- "New user created: [email]"

## Debugging Commands

### Check NextAuth Providers
```bash
curl http://localhost:3000/api/auth/providers
```

### Check Session Status
```bash
curl http://localhost:3000/api/auth/session
```

### Test Database Connection
```bash
npx prisma studio
```

## Environment Variables Checklist

Ensure these are set in your `.env` file:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Email Configuration (Gmail SMTP)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# Database
DATABASE_URL=your-postgresql-connection-string
```

## Gmail App Password Setup

1. Go to Google Account settings
2. Enable 2-factor authentication
3. Generate an App Password for "Mail"
4. Use the generated password as EMAIL_SERVER_PASSWORD

## Common Error Messages

- **"Configuration"**: Server configuration issue
- **"AccessDenied"**: Permission denied
- **"Verification"**: Magic link expired or already used
- **"Default"**: General authentication error

## Production Deployment Notes

1. **Update NEXTAUTH_URL**: Set to your production domain
2. **Secure NEXTAUTH_SECRET**: Use a strong, unique secret
3. **Database Connection**: Ensure production database is accessible
4. **Email Limits**: Be aware of email provider sending limits
5. **HTTPS**: Ensure all URLs use HTTPS in production

## Still Having Issues?

1. Check the browser's Network tab for failed requests
2. Check server logs for detailed error messages
3. Verify all environment variables are set correctly
4. Test with a different email address
5. Clear browser cookies and try again
