const nodemailer = require("nodemailer");
require("dotenv").config();

async function testEmailConfiguration() {
  console.log("Testing email configuration...\n");

  // Check environment variables
  const requiredVars = [
    "EMAIL_SERVER_HOST",
    "EMAIL_SERVER_PORT",
    "EMAIL_SERVER_USER",
    "EMAIL_SERVER_PASSWORD",
    "EMAIL_FROM",
  ];

  console.log("Environment Variables:");
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
  console.log("");

  // Test SMTP connection
  try {
    console.log("Testing SMTP connection...");
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log("✅ SMTP connection successful!");

    // Test sending email
    console.log("Testing email sending...");
    const testEmail = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_SERVER_USER, // Send to yourself for testing
      subject: "NoteFlow Email Test",
      text: "This is a test email from NoteFlow to verify email configuration.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">NoteFlow Email Test</h2>
          <p>This is a test email to verify your email configuration is working correctly.</p>
          <p>If you received this email, your NextAuth email provider is properly configured!</p>
          <p style="color: #6b7280; font-size: 14px;">
            Sent at: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    };

    const result = await transporter.sendMail(testEmail);
    console.log("✅ Test email sent successfully!");
    console.log(`Message ID: ${result.messageId}`);
    console.log("Check your email inbox for the test message.");
  } catch (error) {
    console.error("❌ Email configuration test failed:");
    console.error(error.message);

    if (error.code === "EAUTH") {
      console.log("\n💡 This is likely an authentication error. Please check:");
      console.log("1. Your Gmail app password is correct");
      console.log(
        "2. 2-Factor Authentication is enabled on your Google account"
      );
      console.log("3. You generated an app password specifically for NoteFlow");
    } else if (error.code === "ECONNECTION") {
      console.log("\n💡 This is likely a connection error. Please check:");
      console.log("1. Your internet connection");
      console.log("2. Firewall settings");
      console.log("3. EMAIL_SERVER_HOST and EMAIL_SERVER_PORT are correct");
    }
  }
}

// Run the test
testEmailConfiguration().catch(console.error);
