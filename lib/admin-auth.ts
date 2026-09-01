import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const ADMIN_COOKIE_NAME = "mundial_admin_session";
const ADMIN_TOKEN_VALUE = "authenticated_admin_mundial_session_token";

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, ADMIN_TOKEN_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE_NAME);
  return cookie?.value === ADMIN_TOKEN_VALUE;
}

export async function requireAdminAuth() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    throw new Error("403 - Acceso no autorizado. Se requieren credenciales de administrador.");
  }
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const competition = await prisma.competition.findFirst();
  const validPassword = competition?.adminPassword || process.env.ADMIN_PASSWORD || "admin123";
  return password.trim() === validPassword.trim();
}
