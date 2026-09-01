"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PRESET_ALFAJORES } from "@/lib/presets";
import {
  setAdminSession,
  clearAdminSession,
  requireAdminAuth,
  verifyAdminPassword,
  isAdminAuthenticated,
} from "@/lib/admin-auth";

export async function getOrCreateDefaultCompetition() {
  let competition = await prisma.competition.findFirst({
    include: {
      participants: { orderBy: { createdAt: "asc" }, include: { evaluations: true } },
      products: { orderBy: { orderNumber: "asc" }, include: { evaluations: true } },
      evaluations: { include: { participant: true, product: true } },
      specialVotes: { include: { participant: true, product: true } },
    },
  });

  if (!competition) {
    competition = await prisma.competition.create({
      data: {
        name: "Mundial de Alfajores Argentinos 🏆",
        status: "PREPARATION",
        blindTasting: false,
        resultsVisible: false,
        tasteWeight: 0.8,
        packagingWeight: 0.2,
        adminPassword: "admin123",
      },
      include: {
        participants: { include: { evaluations: true } },
        products: { include: { evaluations: true } },
        evaluations: { include: { participant: true, product: true } },
        specialVotes: { include: { participant: true, product: true } },
      },
    });
  }

  return competition;
}

export async function adminLogin(password: string) {
  const isValid = await verifyAdminPassword(password);
  if (!isValid) {
    throw new Error("Contraseña de administrador incorrecta.");
  }
  await setAdminSession();
  return { success: true };
}

export async function adminLogout() {
  await clearAdminSession();
  return { success: true };
}

export async function checkAdminSession() {
  return isAdminAuthenticated();
}

export async function setCompetitionStatus(
  competitionId: string,
  status: "PREPARATION" | "IN_PROGRESS" | "FINISHED"
) {
  await requireAdminAuth();

  const updated = await prisma.competition.update({
    where: { id: competitionId },
    data: { status },
  });

  revalidatePath("/");
  revalidatePath("/play");
  revalidatePath("/play/tasting");
  revalidatePath("/play/results");
  revalidatePath("/admin/dashboard");

  return updated;
}

export async function setResultsVisible(competitionId: string, visible: boolean) {
  await requireAdminAuth();

  const updated = await prisma.competition.update({
    where: { id: competitionId },
    data: { resultsVisible: visible },
  });

  revalidatePath("/");
  revalidatePath("/play");
  revalidatePath("/play/results");
  revalidatePath("/admin/dashboard");

  return updated;
}

export async function toggleBlindTasting(competitionId: string, enabled: boolean) {
  await requireAdminAuth();

  const updated = await prisma.competition.update({
    where: { id: competitionId },
    data: { blindTasting: enabled },
  });

  revalidatePath("/");
  revalidatePath("/play");
  revalidatePath("/play/tasting");
  revalidatePath("/admin/dashboard");

  return updated;
}

export async function updateCompetitionConfig(
  id: string,
  data: {
    name?: string;
    description?: string;
    blindTasting?: boolean;
    resultsVisible?: boolean;
    tasteWeight?: number;
    packagingWeight?: number;
    status?: string;
    adminPassword?: string;
  }
) {
  await requireAdminAuth();

  const updated = await prisma.competition.update({
    where: { id },
    data,
  });

  revalidatePath("/");
  revalidatePath("/play");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/settings");

  return updated;
}

export async function loadPresetData(competitionId: string) {
  await requireAdminAuth();

  const currentCount = await prisma.product.count({ where: { competitionId } });
  let orderIndex = currentCount + 1;

  for (const alfajor of PRESET_ALFAJORES) {
    await prisma.product.create({
      data: {
        competitionId,
        orderNumber: orderIndex++,
        name: alfajor.name,
        brand: alfajor.brand,
        flavor: alfajor.flavor,
        description: alfajor.description,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/play");
  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");

  return { success: true };
}

export async function resetTournament(
  competitionId: string,
  clearProductsAndParticipants = false
) {
  await requireAdminAuth();

  await prisma.evaluation.deleteMany({
    where: { competitionId },
  });

  await prisma.specialVote.deleteMany({
    where: { competitionId },
  });

  if (clearProductsAndParticipants) {
    await prisma.product.deleteMany({
      where: { competitionId },
    });
    await prisma.participant.deleteMany({
      where: { competitionId },
    });
  }

  await prisma.competition.update({
    where: { id: competitionId },
    data: { status: "PREPARATION", resultsVisible: false },
  });

  revalidatePath("/");
  revalidatePath("/play");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/settings");

  return { success: true };
}
