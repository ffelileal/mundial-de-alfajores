export interface ProductData {
  id: string;
  orderNumber: number;
  name: string;
  brand: string;
  flavor: string;
  image?: string | null;
  description?: string | null;
}

export interface ParticipantData {
  id: string;
  name: string;
  avatarEmoji: string;
}

export interface EvaluationData {
  id: string;
  competitionId: string;
  participantId: string;
  productId: string;
  tasteScore: number;
  packagingScore: number;
  finalScore: number;
  comment?: string | null;
  createdAt: Date | string;
  participant?: ParticipantData;
  product?: ProductData;
}

export interface RankedProduct extends ProductData {
  rank: number;
  tasteAverage: number;
  packagingAverage: number;
  finalScoreAverage: number;
  totalEvaluations: number;
  tasteScores: number[];
  packagingScores: number[];
  comments: { participantName: string; comment: string; tasteScore: number; packagingScore: number }[];
  isTied?: boolean;
  tiebreakerReason?: string;
}

export interface ControversialStat {
  productId: string;
  productName: string;
  brand: string;
  flavor: string;
  highestEvaluation: { participantName: string; score: number; comment?: string };
  lowestEvaluation: { participantName: string; score: number; comment?: string };
  difference: number;
  standardDeviation: number;
}

export interface MundialStatistics {
  champion: RankedProduct | null;
  bestTaste: RankedProduct | null;
  bestPackaging: RankedProduct | null;
  crowdFavorite: {
    product: RankedProduct;
    tenCount: number;
  } | null;
  mostControversial: ControversialStat | null;
  generalAverage: number;
  totalEvaluationsCount: number;
  totalParticipantsCount: number;
  totalProductsCount: number;
  featuredQuotes: {
    participantName: string;
    productName: string;
    comment: string;
    finalScore: number;
    tasteScore: number;
  }[];
  funAwards: {
    category: string;
    title: string;
    icon: string;
    description: string;
    winner: RankedProduct | null;
    extraNote?: string;
  }[];
}

/**
 * Calculates individual evaluation final score.
 * Formula: Final = (Taste * tasteWeight) + (Packaging * packagingWeight)
 * Result is rounded to 1 decimal place.
 */
export function calculateIndividualScore(
  tasteScore: number,
  packagingScore: number,
  tasteWeight = 0.8,
  packagingWeight = 0.2
): number {
  const rawScore = tasteScore * tasteWeight + packagingScore * packagingWeight;
  return Math.round(rawScore * 10) / 10;
}

/**
 * Calculates complete ranking for all products based on their evaluations.
 * Implements strict tie-breaking rules:
 * 1. Highest average final score
 * 2. In case of tie -> Highest average taste score
 * 3. In case of continuing tie -> Count of 10s in taste, then 9s, etc.
 * 4. In case of continuing tie -> Highest average packaging score
 */
export function calculateRanking(
  products: ProductData[],
  evaluations: EvaluationData[],
  participants: ParticipantData[] = []
): RankedProduct[] {
  const participantMap = new Map<string, ParticipantData>();
  participants.forEach((p) => participantMap.set(p.id, p));

  const ranked: RankedProduct[] = products.map((product) => {
    const productEvals = evaluations.filter((e) => e.productId === product.id);
    const totalEvals = productEvals.length;

    if (totalEvals === 0) {
      return {
        ...product,
        rank: 0,
        tasteAverage: 0,
        packagingAverage: 0,
        finalScoreAverage: 0,
        totalEvaluations: 0,
        tasteScores: [],
        packagingScores: [],
        comments: [],
      };
    }

    const tasteSum = productEvals.reduce((acc, curr) => acc + curr.tasteScore, 0);
    const packagingSum = productEvals.reduce((acc, curr) => acc + curr.packagingScore, 0);
    const finalSum = productEvals.reduce((acc, curr) => acc + curr.finalScore, 0);

    const tasteAvg = Math.round((tasteSum / totalEvals) * 10) / 10;
    const packagingAvg = Math.round((packagingSum / totalEvals) * 10) / 10;
    const finalAvg = Math.round((finalSum / totalEvals) * 10) / 10;

    const comments = productEvals
      .filter((e) => e.comment && e.comment.trim().length > 0)
      .map((e) => ({
        participantName:
          e.participant?.name || participantMap.get(e.participantId)?.name || "Participante",
        comment: e.comment!.trim(),
        tasteScore: e.tasteScore,
        packagingScore: e.packagingScore,
      }));

    return {
      ...product,
      rank: 0,
      tasteAverage: tasteAvg,
      packagingAverage: packagingAvg,
      finalScoreAverage: finalAvg,
      totalEvaluations: totalEvals,
      tasteScores: productEvals.map((e) => e.tasteScore),
      packagingScores: productEvals.map((e) => e.packagingScore),
      comments,
    };
  });

  // Sort with tie-breaker logic
  ranked.sort((a, b) => {
    // 1. Primary: Final Score Average
    if (b.finalScoreAverage !== a.finalScoreAverage) {
      return b.finalScoreAverage - a.finalScoreAverage;
    }

    // 2. Tiebreaker 1: Highest average Taste score
    if (b.tasteAverage !== a.tasteAverage) {
      b.tiebreakerReason = "Desempate por mayor puntaje en Sabor";
      a.tiebreakerReason = "Desempate por mayor puntaje en Sabor";
      return b.tasteAverage - a.tasteAverage;
    }

    // 3. Tiebreaker 2: Count of maximum taste scores (10s, then 9s, etc.)
    for (let score = 10; score >= 1; score--) {
      const countB = b.tasteScores.filter((s) => s === score).length;
      const countA = a.tasteScores.filter((s) => s === score).length;
      if (countB !== countA) {
        b.tiebreakerReason = `Desempate por mayor cantidad de notas ${score} en Sabor`;
        a.tiebreakerReason = `Desempate por mayor cantidad de notas ${score} en Sabor`;
        return countB - countA;
      }
    }

    // 4. Tiebreaker 3: Highest Packaging score
    if (b.packagingAverage !== a.packagingAverage) {
      b.tiebreakerReason = "Desempate por mejor Packaging";
      a.tiebreakerReason = "Desempate por mejor Packaging";
      return b.packagingAverage - a.packagingAverage;
    }

    return 0;
  });

  // Assign ranks
  ranked.forEach((item, index) => {
    item.rank = index + 1;
  });

  return ranked;
}

/**
 * Calculates comprehensive statistics for the tournament
 */
export function calculateStatistics(
  products: ProductData[],
  evaluations: EvaluationData[],
  participants: ParticipantData[]
): MundialStatistics {
  const ranked = calculateRanking(products, evaluations, participants);
  const evaluatedProducts = ranked.filter((r) => r.totalEvaluations > 0);

  if (evaluatedProducts.length === 0) {
    return {
      champion: null,
      bestTaste: null,
      bestPackaging: null,
      crowdFavorite: null,
      mostControversial: null,
      generalAverage: 0,
      totalEvaluationsCount: 0,
      totalParticipantsCount: participants.length,
      totalProductsCount: products.length,
      featuredQuotes: [],
      funAwards: [],
    };
  }

  const champion = evaluatedProducts[0];

  // Best Taste
  const bestTaste = [...evaluatedProducts].sort((a, b) => b.tasteAverage - a.tasteAverage)[0];

  // Best Packaging
  const bestPackaging = [...evaluatedProducts].sort(
    (a, b) => b.packagingAverage - a.packagingAverage
  )[0];

  // Crowd Favorite: Product with most 10/10 scores (taste or final)
  let crowdFavorite: { product: RankedProduct; tenCount: number } | null = null;
  let maxTens = -1;
  evaluatedProducts.forEach((p) => {
    const tens = p.tasteScores.filter((s) => s === 10).length;
    if (tens > maxTens && tens > 0) {
      maxTens = tens;
      crowdFavorite = { product: p, tenCount: tens };
    }
  });

  // Most Controversial: Highest gap between highest & lowest score for a single alfajor
  let mostControversial: ControversialStat | null = null;
  let maxDifference = -1;

  const participantMap = new Map<string, ParticipantData>();
  participants.forEach((p) => participantMap.set(p.id, p));

  products.forEach((p) => {
    const pEvals = evaluations.filter((e) => e.productId === p.id);
    if (pEvals.length >= 2) {
      let maxEval = pEvals[0];
      let minEval = pEvals[0];

      pEvals.forEach((ev) => {
        if (ev.finalScore > maxEval.finalScore) maxEval = ev;
        if (ev.finalScore < minEval.finalScore) minEval = ev;
      });

      const diff = Math.round((maxEval.finalScore - minEval.finalScore) * 10) / 10;
      
      // Calculate standard deviation
      const avg = pEvals.reduce((s, e) => s + e.finalScore, 0) / pEvals.length;
      const variance = pEvals.reduce((s, e) => s + Math.pow(e.finalScore - avg, 2), 0) / pEvals.length;
      const stdDev = Math.round(Math.sqrt(variance) * 10) / 10;

      if (diff > maxDifference) {
        maxDifference = diff;
        mostControversial = {
          productId: p.id,
          productName: p.name,
          brand: p.brand,
          flavor: p.flavor,
          highestEvaluation: {
            participantName:
              maxEval.participant?.name ||
              participantMap.get(maxEval.participantId)?.name ||
              "Participante",
            score: maxEval.finalScore,
            comment: maxEval.comment || undefined,
          },
          lowestEvaluation: {
            participantName:
              minEval.participant?.name ||
              participantMap.get(minEval.participantId)?.name ||
              "Participante",
            score: minEval.finalScore,
            comment: minEval.comment || undefined,
          },
          difference: diff,
          standardDeviation: stdDev,
        };
      }
    }
  });

  // General Average
  const totalScoreSum = evaluations.reduce((acc, curr) => acc + curr.finalScore, 0);
  const generalAverage =
    evaluations.length > 0 ? Math.round((totalScoreSum / evaluations.length) * 10) / 10 : 0;

  // Featured Quotes
  const featuredQuotes = evaluations
    .filter((e) => e.comment && e.comment.trim().length > 5)
    .map((e) => ({
      participantName:
        e.participant?.name || participantMap.get(e.participantId)?.name || "Participante",
      productName:
        e.product?.name ||
        products.find((p) => p.id === e.productId)?.name ||
        "Alfajor",
      comment: e.comment!.trim(),
      finalScore: e.finalScore,
      tasteScore: e.tasteScore,
    }))
    .slice(0, 8);

  // Fun Awards
  const funAwards = [
    {
      category: "REY_CHOCOLATE",
      title: "Rey del Chocolate",
      icon: "🍫",
      description: "Alfajor de chocolate con mayor puntaje de sabor.",
      winner:
        evaluatedProducts.find((p) =>
          (p.name + p.flavor + p.brand).toLowerCase().includes("chocolate")
        ) || bestTaste,
    },
    {
      category: "MEJOR_PACKAGING",
      title: "Mejor Packaging",
      icon: "📦",
      description: "El empaque más celebrado de la jornada.",
      winner: bestPackaging,
    },
    {
      category: "MAYOR_SORPRESA",
      title: "La Gran Sorpresa",
      icon: "🤯",
      description: "El alfajor que superó todas las expectativas.",
      winner: evaluatedProducts.length > 1 ? evaluatedProducts[Math.min(1, evaluatedProducts.length - 1)] : champion,
    },
    {
      category: "MAYOR_DECEPCION",
      title: "El Más Castigado",
      icon: "💀",
      description: "El alfajor que prometía pero no convenció al jurado.",
      winner: evaluatedProducts[evaluatedProducts.length - 1],
    },
  ];

  return {
    champion,
    bestTaste,
    bestPackaging,
    crowdFavorite,
    mostControversial,
    generalAverage,
    totalEvaluationsCount: evaluations.length,
    totalParticipantsCount: participants.length,
    totalProductsCount: products.length,
    featuredQuotes,
    funAwards,
  };
}
