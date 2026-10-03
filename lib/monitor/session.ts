import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_S,
  isValidSession,
  signSession,
} from "./token";

export async function createSession() {
  const token = await signSession();
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE_S,
  });
}

export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function hasSession() {
  return isValidSession((await cookies()).get(SESSION_COOKIE)?.value);
}
