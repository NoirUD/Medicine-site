import { readFileSync } from "fs";
import bcrypt from "bcryptjs";

function parseEnvValue(raw) {
  const trimmed = raw.trim();
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed.replace(/\$(\w+|\{[^}]+\})/g, "");
}

const envPath = ".env.local";
const envContent = readFileSync(envPath, "utf8");
const env = {};

for (const line of envContent.split("\n")) {
  if (!line || line.startsWith("#")) continue;
  const eq = line.indexOf("=");
  if (eq === -1) continue;
  env[line.slice(0, eq).trim()] = parseEnvValue(line.slice(eq + 1));
}

const hash = env.ADMIN_PASSWORD_HASH;
const secret = env.SESSION_SECRET;

console.log("ADMIN_PASSWORD_HASH starts with:", hash?.slice(0, 4) ?? "(missing)");
console.log("SESSION_SECRET length:", secret?.length ?? 0);

if (!hash?.startsWith("$2")) {
  console.error("Invalid hash. Use single quotes in .env.local, for example:");
  console.error("ADMIN_PASSWORD_HASH='$2b$12$...'");
  process.exit(1);
}

const password = process.argv[2];
if (!password) {
  console.log("Hash format looks valid. To test a password:");
  console.log('npm run verify-auth -- "your-password"');
  process.exit(0);
}

const ok = await bcrypt.compare(password, hash);
console.log(ok ? "Password matches." : "Password does not match.");
