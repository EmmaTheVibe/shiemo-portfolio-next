import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "monitor_session";
export const SESSION_MAX_AGE_S = 60 * 60 * 24 * 7;

function key() {
  const secret = process.env.MONITOR_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("MONITOR_SESSION_SECRET must be set (32+ chars)");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession() {
  return new SignJWT({ role: "owner" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_S}s`)
    .sign(key());
}

export async function isValidSession(token: string | undefined) {
  if (!token) return false;
  try {
    await jwtVerify(token, key(), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}
