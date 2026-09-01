import "server-only";
import { cookies } from "next/headers";

const PLAYER_COOKIE_NAME = "mundial_player_session";

export interface PlayerSession {
  participantId: string;
  alias: string;
}

export async function setPlayerSession(participantId: string, alias: string) {
  const cookieStore = await cookies();
  const sessionData: PlayerSession = { participantId, alias };
  cookieStore.set(PLAYER_COOKIE_NAME, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function getPlayerSession(): Promise<PlayerSession | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(PLAYER_COOKIE_NAME);
    if (!cookie?.value) return null;
    return JSON.parse(cookie.value) as PlayerSession;
  } catch {
    return null;
  }
}

export async function clearPlayerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(PLAYER_COOKIE_NAME);
}
