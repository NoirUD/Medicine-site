import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash-password -- "your-password"');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);

console.log("Add these lines to .env.local (quotes are required):\n");
console.log(`ADMIN_PASSWORD_HASH='${hash}'`);
console.log(
  "SESSION_SECRET='" +
    (await import("crypto")).randomBytes(48).toString("base64") +
    "'",
);
