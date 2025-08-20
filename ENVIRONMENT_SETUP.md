# Environment Variables Setup for NextAuth Email Authentication

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/noteflow?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-key-here"

# Email Configuration (Gmail SMTP)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-gmail-app-password"
EMAIL_FROM="noreply@noteflow.com"
```

## Production Environment Variables (Vercel)

For production deployment on Vercel, add these environment variables in your Vercel dashboard:

### Required Variables:
- `DATABASE_URL` - Your PostgreSQL database URL
- `NEXTAUTH_URL` - Your production domain (e.g., `https://your-app.vercel.app`)
- `NEXTAUTH_SECRET` - Your generated secret key
- `EMAIL_SERVER_HOST` - `smtp.gmail.com`
- `EMAIL_SERVER_PORT` - `587`
- `EMAIL_SERVER_USER` - Your Gmail address
- `EMAIL_SERVER_PASSWORD` - Your Gmail app password
- `EMAIL_FROM` - `noreply@noteflow.com`

## Gmail App Password Setup

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

### Step 2: Generate App Password
1. Go to Security → 2-Step Verification
2. Scroll down to "App passwords"
3. Select "Mail" and "Other (Custom name)"
4. Enter "NoteFlow" as the name
5. Copy the generated 16-character password
6. Use this password as `EMAIL_SERVER_PASSWORD`

## Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use this online generator: https://generate-secret.vercel.app/32

## Database Setup

### 1. Create Database
```bash
# Create PostgreSQL database
createdb noteflow
```

### 2. Run Prisma Migrations
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npx prisma db push

# Or run migrations
npm run db:migrate
```

### 3. Verify Database Tables
```bash
# Open Prisma Studio to verify tables
npm run db:studio
```

You should see these tables:
- `users`
- `accounts`
- `sessions`
- `verification_tokens`
- `notes`

## Testing Email Configuration

### 1. Test SMTP Connection
```bash
# Test with nodemailer
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});
transporter.verify((error, success) => {
  if (error) console.log('Error:', error);
  else console.log('Server is ready to send emails');
});
"
```

### 2. Test NextAuth Configuration
1. Start development server: `npm run dev`
2. Go to `/auth/signup`
3. Enter your email
4. Check console logs for any errors
5. Check your email for the magic link

## Common Issues and Solutions

### Issue 1: "Invalid login" error
**Solution**: Check your Gmail app password is correct

### Issue 2: "Connection timeout" error
**Solution**: 
- Verify `EMAIL_SERVER_HOST` is `smtp.gmail.com`
- Verify `EMAIL_SERVER_PORT` is `587`
- Check firewall settings

### Issue 3: "Authentication failed" error
**Solution**:
- Ensure 2FA is enabled on Gmail
- Regenerate app password
- Check `EMAIL_SERVER_USER` and `EMAIL_SERVER_PASSWORD`

### Issue 4: "Database connection failed" error
**Solution**:
- Verify `DATABASE_URL` is correct
- Ensure database is running
- Check database permissions

### Issue 5: "Missing environment variables" error
**Solution**:
- Ensure all required variables are set
- Restart development server after adding variables
- Check variable names for typos

## Debug Mode

Enable debug mode by setting:
```env
NODE_ENV=development
```

This will show detailed logs in the console for troubleshooting.

## Security Notes

1. **Never commit `.env` files** to version control
2. **Use app passwords** instead of your main Gmail password
3. **Rotate secrets** regularly in production
4. **Use HTTPS** in production for `NEXTAUTH_URL`
5. **Limit email sending** to prevent abuse

## Vercel Deployment Checklist

- [ ] All environment variables set in Vercel dashboard
- [ ] Database accessible from Vercel
- [ ] `NEXTAUTH_URL` set to production domain
- [ ] `NEXTAUTH_SECRET` is secure and unique
- [ ] Email configuration tested
- [ ] Database migrations run
- [ ] Prisma client generated during build
