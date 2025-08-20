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
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after successful sign-in
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // If signing in from magic link, redirect to dashboard
      return `${baseUrl}/dashboard`;
    },
  },
  events: {
    async signIn({ user }) {
      try {
        // Update user's emailVerified field when they sign in
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        });
        console.log("User signed in:", user.email);
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
