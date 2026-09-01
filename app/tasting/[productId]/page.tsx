import { redirect } from "next/navigation";
import { getOrCreateDefaultCompetition } from "@/actions/competition";
import { TastingEvaluationForm } from "@/components/TastingEvaluationForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface TastingProductPageProps {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ participantId?: string }>;
}

export default async function TastingProductPage({
  params,
  searchParams,
}: TastingProductPageProps) {
  const { productId } = await params;
  const { participantId } = await searchParams;

  if (!participantId) {
    redirect("/tasting");
  }

  const competition = await getOrCreateDefaultCompetition();
  const participant = competition.participants.find((p) => p.id === participantId);
  const currentProduct = competition.products.find((p) => p.id === productId);

  if (!participant || !currentProduct) {
    redirect("/tasting");
  }

  // Check if already evaluated
  const existingEval = competition.evaluations.find(
    (e) => e.participantId === participantId && e.productId === productId
  );

  const allProducts = competition.products || [];
  const userEvals = competition.evaluations.filter((e) => e.participantId === participantId);

  // If already evaluated, find next unrated product or complete
  if (existingEval) {
    const nextUnrated = allProducts.find(
      (p) => !userEvals.some((ev) => ev.productId === p.id)
    );
    if (nextUnrated) {
      redirect(`/tasting/${nextUnrated.id}?participantId=${participantId}`);
    } else {
      redirect(`/tasting/complete?participantId=${participantId}`);
    }
  }

  // Find next product in sequence
  const currentProductIndex = allProducts.findIndex((p) => p.id === productId) + 1;
  const remainingUnrated = allProducts.filter(
    (p) => p.id !== productId && !userEvals.some((ev) => ev.productId === p.id)
  );
  const nextProductId = remainingUnrated.length > 0 ? remainingUnrated[0].id : null;

  return (
    <div className="py-2 sm:py-4 space-y-4">
      {/* Back to participant list button */}
      <div>
        <Link
          href="/tasting"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#786556] hover:text-[#54311c] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cambiar de participante</span>
        </Link>
      </div>

      <TastingEvaluationForm
        competitionId={competition.id}
        participant={participant}
        product={currentProduct}
        totalProducts={allProducts.length}
        currentProductIndex={currentProductIndex}
        nextProductId={nextProductId}
        blindTasting={competition.blindTasting}
        tasteWeight={competition.tasteWeight}
        packagingWeight={competition.packagingWeight}
      />
    </div>
  );
}
