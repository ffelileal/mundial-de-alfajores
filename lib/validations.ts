import { z } from "zod";

export const participantSchema = z.object({
  name: z.string().trim().min(1, "El nombre del participante no puede estar vacío").max(50, "El nombre es demasiado largo"),
  avatarEmoji: z.string().optional().default("👤"),
  competitionId: z.string().min(1, "ID de competencia requerido"),
});

export const productSchema = z.object({
  name: z.string().trim().min(1, "El nombre del alfajor no puede estar vacío").max(80, "Nombre demasiado largo"),
  brand: z.string().trim().min(1, "La marca no puede estar vacía").max(60, "Marca demasiado larga"),
  flavor: z.string().trim().min(1, "La variedad/sabor no puede estar vacía").max(80, "Sabor demasiado largo"),
  image: z.string().trim().url("Debe ser una URL válida").optional().or(z.literal("")),
  description: z.string().trim().max(300, "Descripción demasiado larga").optional().or(z.literal("")),
  competitionId: z.string().min(1, "ID de competencia requerido"),
  orderNumber: z.number().int().min(1).optional(),
});

export const evaluationSchema = z.object({
  competitionId: z.string().min(1, "ID de competencia requerido"),
  participantId: z.string().min(1, "Participante requerido"),
  productId: z.string().min(1, "Alfajor requerido"),
  tasteScore: z.coerce.number().min(1, "La puntuación mínima es 1").max(10, "La puntuación máxima es 10"),
  packagingScore: z.coerce.number().min(1, "La puntuación mínima es 1").max(10, "La puntuación máxima es 10"),
  comment: z.string().trim().max(500, "El comentario no puede superar los 500 caracteres").optional().or(z.literal("")),
});

export const competitionConfigSchema = z.object({
  name: z.string().trim().min(1, "El nombre del Mundial no puede estar vacío").max(100),
  blindTasting: z.boolean(),
  tasteWeight: z.number().min(0).max(1).default(0.8),
  packagingWeight: z.number().min(0).max(1).default(0.2),
  status: z.enum(["DRAFT", "IN_PROGRESS", "COMPLETED"]).default("IN_PROGRESS"),
});

export const specialVoteSchema = z.object({
  competitionId: z.string().min(1),
  participantId: z.string().min(1),
  productId: z.string().min(1),
  category: z.string().min(1),
});
