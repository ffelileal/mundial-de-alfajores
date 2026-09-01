"use server";

import { prisma } from "@/lib/prisma";
import { evaluationSchema } from "@/lib/validations";
import { calculateIndividualScore } from "@/lib/scoring";
import { revalidatePath } from "next/cache";

export async function submitEvaluation(formData: {
  competitionId: string;
  participantId: string;
  productId: string;
  tasteScore: number;
  packagingScore: number;
  comment?: string;
}) {
  const validated = evaluationSchema.parse(formData);

  // Fetch competition details and status
  const competition = await prisma.competition.findUnique({
    where: { id: validated.competitionId },
  });

  if (!competition) {
    throw new Error("Competencia no encontrada.");
  }

  if (competition.status === "PREPARATION") {
    throw new Error("El Mundial todavía está en preparación. Esperá a que el administrador dé inicio a la competencia.");
  }

  if (competition.status === "FINISHED") {
    throw new Error("El Mundial ya ha finalizado. No se pueden registrar más evaluaciones.");
  }

  // Verify participant belongs to competition and is active
  const participant = await prisma.participant.findFirst({
    where: {
      id: validated.participantId,
      competitionId: validated.competitionId,
    },
  });

  if (!participant) {
    throw new Error("El participante no pertenece a esta competencia.");
  }

  if (participant.status === "BLOCKED") {
    throw new Error("Tu usuario está bloqueado por el administrador.");
  }

  // Verify product belongs to competition
  const product = await prisma.product.findFirst({
    where: {
      id: validated.productId,
      competitionId: validated.competitionId,
    },
  });

  if (!product) {
    throw new Error("El alfajor no pertenece a esta competencia.");
  }

  const tasteWeight = competition.tasteWeight ?? 0.8;
  const packagingWeight = competition.packagingWeight ?? 0.2;

  const finalScore = calculateIndividualScore(
    validated.tasteScore,
    validated.packagingScore,
    tasteWeight,
    packagingWeight
  );

  // Check if evaluation already exists to prevent duplicate
  const existing = await prisma.evaluation.findUnique({
    where: {
      participantId_productId: {
        participantId: validated.participantId,
        productId: validated.productId,
      },
    },
  });

  if (existing) {
    throw new Error("Ya has registrado una puntuación para este alfajor.");
  }

  const evaluation = await prisma.evaluation.create({
    data: {
      competitionId: validated.competitionId,
      participantId: validated.participantId,
      productId: validated.productId,
      tasteScore: validated.tasteScore,
      packagingScore: validated.packagingScore,
      finalScore: finalScore,
      comment: validated.comment ? validated.comment.trim() : null,
    },
  });

  revalidatePath("/");
  revalidatePath("/play");
  revalidatePath("/play/tasting");
  revalidatePath("/play/results");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/participants");
  revalidatePath("/admin/results");

  return evaluation;
}

export async function getParticipantEvaluations(participantId: string, competitionId: string) {
  return prisma.evaluation.findMany({
    where: {
      participantId,
      competitionId,
    },
    include: {
      product: true,
    },
  });
}
