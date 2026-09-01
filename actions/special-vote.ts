"use server";

import { prisma } from "@/lib/prisma";
import { specialVoteSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function submitSpecialVote(formData: {
  competitionId: string;
  participantId: string;
  productId: string;
  category: string;
}) {
  const validated = specialVoteSchema.parse(formData);

  // Upsert special vote for this category & participant
  const vote = await prisma.specialVote.upsert({
    where: {
      participantId_category_competitionId: {
        participantId: validated.participantId,
        category: validated.category,
        competitionId: validated.competitionId,
      },
    },
    update: {
      productId: validated.productId,
    },
    create: {
      competitionId: validated.competitionId,
      participantId: validated.participantId,
      productId: validated.productId,
      category: validated.category,
    },
  });

  revalidatePath("/results");
  revalidatePath("/ranking");

  return vote;
}

export async function getSpecialVotes(competitionId: string) {
  return prisma.specialVote.findMany({
    where: { competitionId },
    include: {
      participant: true,
      product: true,
    },
  });
}
