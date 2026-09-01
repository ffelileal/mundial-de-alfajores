"use server";

import { prisma } from "@/lib/prisma";
import { setPlayerSession } from "@/lib/player-auth";
import { getOrCreateDefaultCompetition } from "@/actions/competition";
import { EMOJI_AVATARS } from "@/lib/presets";
import { revalidatePath } from "next/cache";

export async function loginOrRegisterPlayer(rawAlias: string) {
  const alias = rawAlias?.trim();
  if (!alias || alias.length < 1) {
    throw new Error("Por favor, ingresá un nombre o alias para continuar.");
  }

  const competition = await getOrCreateDefaultCompetition();

  // Find existing participant by alias (case-insensitive in SQLite by matching trimmed alias)
  let participant = await prisma.participant.findFirst({
    where: {
      competitionId: competition.id,
      alias: {
        equals: alias,
      },
    },
  });

  let isNew = false;

  if (!participant) {
    // Pick a random avatar emoji
    const randomEmoji = EMOJI_AVATARS[Math.floor(Math.random() * EMOJI_AVATARS.length)] || "👤";

    participant = await prisma.participant.create({
      data: {
        competitionId: competition.id,
        alias,
        name: alias,
        avatarEmoji: randomEmoji,
        status: "ACTIVE",
      },
    });
    isNew = true;
  }

  // Set player session cookie
  await setPlayerSession(participant.id, participant.alias);

  revalidatePath("/");
  revalidatePath("/play");
  revalidatePath("/play/tasting");

  return {
    success: true,
    participantId: participant.id,
    alias: participant.alias,
    isNew,
  };
}

export async function getPlayerStatus(participantId: string) {
  const competition = await getOrCreateDefaultCompetition();

  const participant = await prisma.participant.findUnique({
    where: { id: participantId },
    include: {
      evaluations: true,
    },
  });

  if (!participant) {
    return null;
  }

  const products = await prisma.product.findMany({
    where: { competitionId: competition.id },
    orderBy: { orderNumber: "asc" },
  });

  const evaluatedProductIds = new Set(participant.evaluations.map((e) => e.productId));
  const unevaluatedProducts = products.filter((p) => !evaluatedProductIds.has(p.id));
  const nextProduct = unevaluatedProducts[0] || null;

  return {
    competition: {
      id: competition.id,
      name: competition.name,
      status: competition.status,
      blindTasting: competition.blindTasting,
      resultsVisible: competition.resultsVisible,
    },
    participant: {
      id: participant.id,
      alias: participant.alias,
      name: participant.name,
      avatarEmoji: participant.avatarEmoji,
      evaluationsCount: participant.evaluations.length,
      isFinished: products.length > 0 && participant.evaluations.length >= products.length,
    },
    totalProducts: products.length,
    evaluatedCount: participant.evaluations.length,
    nextProductId: nextProduct?.id || null,
  };
}

export async function logoutPlayer() {
  const { clearPlayerSession } = await import("@/lib/player-auth");
  await clearPlayerSession();
  revalidatePath("/");
  revalidatePath("/play");
  return { success: true };
}

