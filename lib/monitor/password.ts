import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LEN = 64;

// Stored format: "<salt hex>:<scrypt hash hex>"
export function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, KEY_LEN);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPassword(password: string) {
  const stored = process.env.MONITOR_PASSWORD_HASH;
  if (!stored) return false;
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, Buffer.from(saltHex, "hex"), KEY_LEN);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
