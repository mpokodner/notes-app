const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

async function testMagicLinkFlow() {
  console.log("🔍 Testing Magic Link Authentication Flow...\n");

  try {
    // 1. Check if there are any existing verification tokens
    console.log("📋 Checking existing verification tokens...");
    const verificationTokens = await prisma.verificationToken.findMany();
    console.log(`Found ${verificationTokens.length} verification tokens`);

    if (verificationTokens.length > 0) {
      verificationTokens.forEach((token) => {
        const isExpired = new Date() > token.expires;
        console.log(
          `  - ${token.identifier} (expires: ${token.expires.toISOString()}) ${
            isExpired ? "❌ EXPIRED" : "✅ VALID"
          }`
        );
      });
    }

    // 2. Check existing users
    console.log("\n👥 Checking existing users...");
    const users = await prisma.user.findMany({
      select: { id: true, email: true, emailVerified: true, createdAt: true },
    });

    console.log(`Found ${users.length} users:`);
    users.forEach((user) => {
      console.log(
        `  - ${
          user.email
        } (verified: ${!!user.emailVerified}, created: ${user.createdAt.toISOString()})`
      );
    });

    // 3. Check existing sessions
    console.log("\n🔐 Checking existing sessions...");
    const sessions = await prisma.session.findMany({
      select: { id: true, userId: true, expires: true },
    });

    console.log(`Found ${sessions.length} sessions:`);
    sessions.forEach((session) => {
      const isExpired = new Date() > session.expires;
      console.log(
        `  - Session ${
          session.id
        } (expires: ${session.expires.toISOString()}) ${
          isExpired ? "❌ EXPIRED" : "✅ VALID"
        }`
      );
    });

    // 4. Test NextAuth API endpoints
    console.log("\n🌐 Testing NextAuth API endpoints...");

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    // Test providers endpoint
    try {
      const providersResponse = await fetch(`${baseUrl}/api/auth/providers`);
      if (providersResponse.ok) {
        const providers = await providersResponse.json();
        console.log("✅ Providers endpoint working:", Object.keys(providers));
      } else {
        console.log("❌ Providers endpoint failed:", providersResponse.status);
      }
    } catch (error) {
      console.log("❌ Providers endpoint error:", error.message);
    }

    // Test session endpoint
    try {
      const sessionResponse = await fetch(`${baseUrl}/api/auth/session`);
      if (sessionResponse.ok) {
        const session = await sessionResponse.json();
        console.log("✅ Session endpoint working:", session);
      } else {
        console.log("❌ Session endpoint failed:", sessionResponse.status);
      }
    } catch (error) {
      console.log("❌ Session endpoint error:", error.message);
    }

    // 5. Check environment variables
    console.log("\n🔧 Environment Variables Check:");
    const requiredVars = [
      "NEXTAUTH_URL",
      "NEXTAUTH_SECRET",
      "EMAIL_SERVER_HOST",
      "EMAIL_SERVER_PORT",
      "EMAIL_SERVER_USER",
      "EMAIL_SERVER_PASSWORD",
      "EMAIL_FROM",
      "DATABASE_URL",
    ];

    for (const varName of requiredVars) {
      const value = process.env[varName];
      if (value) {
        console.log(
          `✅ ${varName}: ${varName.includes("PASSWORD") ? "***" : value}`
        );
      } else {
        console.log(`❌ ${varName}: MISSING`);
      }
    }

    // 6. Clean up expired tokens
    console.log("\n🧹 Cleaning up expired verification tokens...");
    const expiredTokens = await prisma.verificationToken.findMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    });

    if (expiredTokens.length > 0) {
      await prisma.verificationToken.deleteMany({
        where: {
          expires: {
            lt: new Date(),
          },
        },
      });
      console.log(`✅ Deleted ${expiredTokens.length} expired tokens`);
    } else {
      console.log("✅ No expired tokens to clean up");
    }

    console.log("\n🎯 Magic Link Flow Test Complete!");
    console.log("\n📝 Next Steps:");
    console.log("1. Start the development server: npm run dev");
    console.log("2. Visit: http://localhost:3000/auth/signin");
    console.log("3. Enter your email to request a magic link");
    console.log("4. Check your email and click the magic link");
    console.log("5. You should be redirected to /dashboard");
    console.log("6. Check the server console for debug messages");
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testMagicLinkFlow().catch(console.error);
