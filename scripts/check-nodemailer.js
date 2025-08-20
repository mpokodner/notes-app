console.log("Checking nodemailer installation...\n");

try {
  // Try CommonJS import
  const nodemailer = require("nodemailer");
  console.log("✅ nodemailer imported successfully (CommonJS)");
  console.log(`📦 Version: ${nodemailer.version}`);

  // Check if createTransport function exists
  if (typeof nodemailer.createTransport === "function") {
    console.log("✅ createTransport function is available");
  } else {
    console.log("❌ createTransport function is NOT available");
    console.log(
      "Available functions:",
      Object.keys(nodemailer).filter(
        (key) => typeof nodemailer[key] === "function"
      )
    );
  }

  // Check if createTransporter function exists (common typo)
  if (typeof nodemailer.createTransporter === "function") {
    console.log("⚠️  createTransporter function exists (this is unusual)");
  } else {
    console.log(
      "✅ createTransporter function does not exist (this is correct)"
    );
  }
} catch (error) {
  console.error("❌ Failed to import nodemailer (CommonJS):", error.message);
}

console.log("\n" + "=".repeat(50) + "\n");

try {
  // Try ES module import
  const { createRequire } = await import("module");
  const require = createRequire(import.meta.url);
  const nodemailer = require("nodemailer");
  console.log("✅ nodemailer imported successfully (ES Module)");
  console.log(`📦 Version: ${nodemailer.version}`);

  if (typeof nodemailer.createTransport === "function") {
    console.log("✅ createTransport function is available");
  } else {
    console.log("❌ createTransport function is NOT available");
  }
} catch (error) {
  console.error("❌ Failed to import nodemailer (ES Module):", error.message);
}

console.log("\n" + "=".repeat(50) + "\n");

// Check package.json
try {
  const fs = require("fs");
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  console.log(
    "📋 Package.json nodemailer version:",
    packageJson.dependencies.nodemailer
  );
} catch (error) {
  console.error("❌ Failed to read package.json:", error.message);
}

console.log("\n" + "=".repeat(50) + "\n");

// Check node_modules
try {
  const fs = require("fs");
  const path = require("path");
  const nodemailerPath = path.join(
    "node_modules",
    "nodemailer",
    "package.json"
  );

  if (fs.existsSync(nodemailerPath)) {
    const nodemailerPackage = JSON.parse(
      fs.readFileSync(nodemailerPath, "utf8")
    );
    console.log(
      "📁 node_modules/nodemailer version:",
      nodemailerPackage.version
    );
    console.log("📁 node_modules/nodemailer main:", nodemailerPackage.main);
  } else {
    console.log("❌ nodemailer not found in node_modules");
  }
} catch (error) {
  console.error("❌ Failed to check node_modules:", error.message);
}
