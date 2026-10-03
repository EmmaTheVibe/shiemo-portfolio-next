// Usage: MONITOR_PW='your password' node scripts/hash-password.mjs
import { randomBytes, scryptSync } from "node:crypto";

const pw = process.env.MONITOR_PW;
if (!pw) {
  console.error("Set MONITOR_PW in the environment.");
  process.exit(1);
}
const salt = randomBytes(16);
console.log(`${salt.toString("hex")}:${scryptSync(pw, salt, 64).toString("hex")}`);
