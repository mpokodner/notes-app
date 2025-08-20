const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

async function testAuthConfiguration() {
  console.log("🔍 Testing NextAuth Configuration...\n");

  // Check environment variables
  console.log("📋 Environment Variables:");
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

  console.log("\n🔗 Database Connection:");
  try {
    await prisma.$connect();
    console.log("✅ Database connection successful");

    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'accounts', 'sessions', 'verification_tokens', 'notes')
    `;

    console.log("📊 Database tables:");
    const tableNames = tables.map((t) => t.table_name);
    const expectedTables = [
      "users",
      "accounts",
      "sessions",
      "verification_tokens",
      "notes",
    ];

    for (const table of expectedTables) {
      if (tableNames.includes(table)) {
        console.log(`✅ ${table}`);
      } else {
        console.log(`❌ ${table} - MISSING`);
      }
    }

    // Check for existing users
    const userCount = await prisma.user.count();
    console.log(`\n👥 Users in database: ${userCount}`);

    if (userCount > 0) {
      const users = await prisma.user.findMany({
        select: { id: true, email: true, emailVerified: true, createdAt: true },
      });
      console.log("📝 User details:");
      users.forEach((user) => {
        console.log(
          `  - ${
            user.email
          } (verified: ${!!user.emailVerified}, created: ${user.createdAt.toISOString()})`
        );
      });
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n🎯 NextAuth Configuration Test Complete!");
  console.log("\n📝 Next Steps:");
  console.log("1. Start the development server: npm run dev");
  console.log("2. Visit: http://localhost:3000/auth/signin");
  console.log("3. Enter your email to test magic link authentication");
  console.log("4. Check the console for any error messages");
}

testAuthConfiguration().catch(console.error);
