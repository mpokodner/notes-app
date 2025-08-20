import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering for NextAuth API routes
export const dynamic = "force-dynamic";

// Validate required environment variables
const requiredEnvVars = {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
  EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
  EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
  EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM,
  DATABASE_URL: process.env.DATABASE_URL,
};

// Check for missing environment variables
const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingEnvVars.length > 0) {
  console.error("Missing required environment variables:", missingEnvVars);
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
}

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST!,
        port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
        auth: {
          user: process.env.EMAIL_SERVER_USER!,
          pass: process.env.EMAIL_SERVER_PASSWORD!,
        },
        secure: false,
        tls: {
          rejectUnauthorized: false,
        },
      },
      from: process.env.EMAIL_FROM!,
      // Custom email template for better UX
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        try {
          console.log("Sending verification email to:", identifier);
          console.log("Email URL:", url);

          const transport = await import("nodemailer").then((mod) =>
            mod.createTransport({
              host: process.env.EMAIL_SERVER_HOST!,
              port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
              auth: {
                user: process.env.EMAIL_SERVER_USER!,
                pass: process.env.EMAIL_SERVER_PASSWORD!,
              },
              secure: false,
              tls: {
                rejectUnauthorized: false,
              },
            })
          );

          const result = await transport.sendMail({
            to: identifier,
            from: provider.from,
            subject: `Sign in to NoteFlow`,
            text: `Click here to sign in: ${url}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #2563eb; margin: 0; font-size: 28px;">NoteFlow</h1>
                  <p style="color: #6b7280; margin: 10px 0 0 0;">Your secure note-taking app</p>
                </div>
                
                <div style="background-color: #f8fafc; border-radius: 8px; padding: 30px; text-align: center;">
                  <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Sign in to NoteFlow</h2>
                  <p style="color: #4b5563; margin: 0 0 30px 0; font-size: 16px; line-height: 1.5;">
                    Click the button below to securely sign in to your account. This link will expire in 24 hours.
                  </p>
                  
                  <a href="${url}" style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 20px 0;">
                    Sign in to NoteFlow
                  </a>
                  
                  <p style="color: #6b7280; font-size: 14px; margin: 30px 0 0 0;">
                    If you didn't request this email, you can safely ignore it.
                  </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    © 2024 NoteFlow. All rights reserved.
                  </p>
                </div>
              </div>
            `,
          });

          console.log("Email sent successfully:", result.messageId);
        } catch (error) {
          console.error("Error sending verification email:", error);
          throw new Error("Failed to send verification email");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback - url:", url, "baseUrl:", baseUrl);

      // Handle magic link redirects - always go to dashboard
      if (url.startsWith("/")) {
        // If it's a relative URL, make it absolute
        const redirectUrl = `${baseUrl}${url}`;
        console.log("Redirecting to relative URL:", redirectUrl);
        return redirectUrl;
      } else if (new URL(url).origin === baseUrl) {
        // Same origin, allow the URL
        console.log("Redirecting to same origin URL:", url);
        return url;
      }

      // Default redirect to dashboard for successful authentication
      console.log("Redirecting to dashboard:", `${baseUrl}/dashboard`);
      return `${baseUrl}/dashboard`;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      try {
        if (isNewUser) {
          console.log("New user signed in:", user.email);
        } else {
          console.log("Existing user signed in:", user.email);
        }

        // Update user's emailVerified field when they sign in
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        });
      } catch (error) {
        console.error("Error updating user emailVerified:", error);
        // Don't throw error here as it would prevent sign-in
      }
    },
    async createUser({ user }) {
      console.log("New user created:", user.email);
    },
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
