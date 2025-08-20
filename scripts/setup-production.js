const fs = require("fs");
const path = require("path");

console.log("🚀 Setting up production environment variables...\n");

// Production environment variables
const productionEnvVars = {
  NEXTAUTH_URL: "https://notes-okg35ct45-mpokodners-projects.vercel.app",
  NEXTAUTH_SECRET: "34BSd6ZT2WBZLSGQoRQQa+zPV+dDATiHIbJOszcWxwk=",
  EMAIL_SERVER_HOST: "smtp.gmail.com",
  EMAIL_SERVER_PORT: "587",
  EMAIL_SERVER_USER: "mpokodner@gmail.com",
  EMAIL_SERVER_PASSWORD: "YOUR_GMAIL_APP_PASSWORD", // You need to replace this
  EMAIL_FROM: "mpokodner@gmail.com",
  DATABASE_URL:
    "postgresql://neondb_owner:npg_H3sY5yhGmzvR@ep-dawn-flower-aeiglpxw-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
};

console.log("📋 Production Environment Variables:");
console.log("=====================================");

Object.entries(productionEnvVars).forEach(([key, value]) => {
  if (key.includes("PASSWORD")) {
    console.log(`${key}=***`);
  } else {
    console.log(`${key}=${value}`);
  }
});

console.log("\n🔧 Next Steps:");
console.log("1. Go to your Vercel dashboard");
console.log("2. Navigate to your project settings");
console.log('3. Go to "Environment Variables" section');
console.log(
  "4. Add each variable above (replace EMAIL_SERVER_PASSWORD with your actual Gmail app password)"
);
console.log("5. Redeploy your application");

console.log("\n⚠️  Important Notes:");
console.log(
  "- Make sure to replace EMAIL_SERVER_PASSWORD with your actual Gmail app password"
);
console.log("- The NEXTAUTH_URL must match your production domain exactly");
console.log("- After setting environment variables, redeploy your application");

console.log("\n🔗 Vercel Dashboard URL:");
console.log("https://vercel.com/dashboard");

console.log("\n📧 Gmail App Password Setup:");
console.log("1. Go to your Google Account settings");
console.log("2. Enable 2-factor authentication");
console.log('3. Generate an App Password for "Mail"');
console.log("4. Use that password as EMAIL_SERVER_PASSWORD");

console.log(
  "\n✅ Once you've set these environment variables in Vercel, your magic link authentication should work correctly!"
);
