"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/admin-auth";

export async function getParticipants(competitionId: string) {
  return prisma.participant.findMany({
    where: { competitionId },
    orderBy: { createdAt: "asc" },
    include: {
      evaluations: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function deleteParticipant(id: string) {
  await requireAdminAuth();

  await prisma.participant.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/play");
  revalidatePath("/admin/participants");
  revalidatePath("/admin/dashboard");

  return { success: true };
}

export async function resetParticipantProgress(participantId: string) {
  await requireAdminAuth();

  await prisma.evaluation.deleteMany({
    where: { participantId },
  });

  await prisma.specialVote.deleteMany({
    where: { participantId },
  });

  revalidatePath("/");
  revalidatePath("/play");
  revalidatePath("/admin/participants");
  revalidatePath("/admin/dashboard");

  return { success: true };
}
