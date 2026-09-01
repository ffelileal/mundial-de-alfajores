"use server";

import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/admin-auth";

export async function getProducts(competitionId: string) {
  return prisma.product.findMany({
    where: { competitionId },
    orderBy: { orderNumber: "asc" },
    include: {
      evaluations: true,
    },
  });
}

export async function addProduct(formData: {
  competitionId: string;
  name: string;
  brand: string;
  flavor: string;
  image?: string;
  description?: string;
}) {
  await requireAdminAuth();

  const validated = productSchema.parse(formData);

  const highestOrder = await prisma.product.findFirst({
    where: { competitionId: validated.competitionId },
    orderBy: { orderNumber: "desc" },
    select: { orderNumber: true },
  });

  const nextOrderNumber = (highestOrder?.orderNumber ?? 0) + 1;

  const product = await prisma.product.create({
    data: {
      competitionId: validated.competitionId,
      orderNumber: nextOrderNumber,
      name: validated.name,
      brand: validated.brand,
      flavor: validated.flavor,
      image: validated.image || null,
      description: validated.description || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/play");
  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");

  return product;
}

export async function updateProduct(
  id: string,
  formData: {
    name?: string;
    brand?: string;
    flavor?: string;
    image?: string;
    description?: string;
  }
) {
  await requireAdminAuth();

  const updated = await prisma.product.update({
    where: { id },
    data: {
      ...formData,
      image: formData.image || null,
      description: formData.description || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/play");
  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");

  return updated;
}

export async function deleteProduct(id: string) {
  await requireAdminAuth();

  const productToDelete = await prisma.product.findUnique({
    where: { id },
    select: { competitionId: true, orderNumber: true },
  });

  await prisma.product.delete({
    where: { id },
  });

  if (productToDelete) {
    // Re-index remaining products order numbers
    const remaining = await prisma.product.findMany({
      where: { competitionId: productToDelete.competitionId },
      orderBy: { orderNumber: "asc" },
    });

    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].orderNumber !== i + 1) {
        await prisma.product.update({
          where: { id: remaining[i].id },
          data: { orderNumber: i + 1 },
        });
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/play");
  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");

  return { success: true };
}
