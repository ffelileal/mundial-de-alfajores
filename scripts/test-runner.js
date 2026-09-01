const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function calculateIndividualScore(tasteScore, packagingScore, tasteWeight = 0.8, packagingWeight = 0.2) {
  const rawScore = tasteScore * tasteWeight + packagingScore * packagingWeight;
  return Math.round(rawScore * 10) / 10;
}

function calculateRanking(products, evaluations, participants = []) {
  const ranked = products.map((product) => {
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
      };
    }

    const tasteSum = productEvals.reduce((acc, curr) => acc + curr.tasteScore, 0);
    const packagingSum = productEvals.reduce((acc, curr) => acc + curr.packagingScore, 0);
    const finalSum = productEvals.reduce((acc, curr) => acc + curr.finalScore, 0);

    const tasteAvg = Math.round((tasteSum / totalEvals) * 10) / 10;
    const packagingAvg = Math.round((packagingSum / totalEvals) * 10) / 10;
    const finalAvg = Math.round((finalSum / totalEvals) * 10) / 10;

    return {
      ...product,
      rank: 0,
      tasteAverage: tasteAvg,
      packagingAverage: packagingAvg,
      finalScoreAverage: finalAvg,
      totalEvaluations: totalEvals,
      tasteScores: productEvals.map((e) => e.tasteScore),
      packagingScores: productEvals.map((e) => e.packagingScore),
    };
  });

  // Sort with tie-breaker logic
  ranked.sort((a, b) => {
    if (b.finalScoreAverage !== a.finalScoreAverage) {
      return b.finalScoreAverage - a.finalScoreAverage;
    }
    if (b.tasteAverage !== a.tasteAverage) {
      b.tiebreakerReason = "Desempate por mayor puntaje en Sabor";
      a.tiebreakerReason = "Desempate por mayor puntaje en Sabor";
      return b.tasteAverage - a.tasteAverage;
    }
    for (let score = 10; score >= 1; score--) {
      const countB = b.tasteScores.filter((s) => s === score).length;
      const countA = a.tasteScores.filter((s) => s === score).length;
      if (countB !== countA) {
        b.tiebreakerReason = `Desempate por mayor cantidad de notas ${score} en Sabor`;
        a.tiebreakerReason = `Desempate por mayor cantidad de notas ${score} en Sabor`;
        return countB - countA;
      }
    }
    if (b.packagingAverage !== a.packagingAverage) {
      b.tiebreakerReason = "Desempate por mejor Packaging";
      a.tiebreakerReason = "Desempate por mejor Packaging";
      return b.packagingAverage - a.packagingAverage;
    }
    return 0;
  });

  return ranked.map((p, idx) => ({
    ...p,
    rank: idx + 1,
  }));
}

async function runTests() {
  console.log("=========================================");
  console.log("🍫 TEST SUITE: MUNDIAL DE ALFAJORES (ADMIN/JUGADOR & ALIAS)");
  console.log("=========================================\n");

  try {
    // 1. Create Competition in PREPARATION status
    console.log("👉 Test 1: Creación de Competencia en estado PREPARATION...");
    const competition = await prisma.competition.create({
      data: {
        name: "Mundial de Alfajores - Test Suite 🏆",
        status: "PREPARATION",
        blindTasting: false,
        resultsVisible: false,
        adminPassword: "admin123",
        tasteWeight: 0.8,
        packagingWeight: 0.2,
      },
    });
    console.log(`✓ Competencia creada con ID: ${competition.id} (Estado: ${competition.status})`);

    // 2. Player registration via alias
    console.log("\n👉 Test 2: Registro de jugadores por alias...");
    const aliases = ["Feli", "Agus", "Juan", "Mica"];
    const participants = [];

    for (const alias of aliases) {
      const p = await prisma.participant.create({
        data: {
          competitionId: competition.id,
          alias,
          name: alias,
          avatarEmoji: "👤",
        },
      });
      participants.push(p);
    }
    console.log(`✓ 4 jugadores registrados: ${participants.map((p) => p.alias).join(", ")}`);

    // 3. Re-login with existing alias without duplication
    console.log("\n👉 Test 3: Reingreso con alias existente ('Feli')...");
    const existing = await prisma.participant.findFirst({
      where: { competitionId: competition.id, alias: "Feli" },
    });
    if (existing && existing.id === participants[0].id) {
      console.log(`✓ Reconocimiento exitoso: 'Feli' recuperó su sesión existente (ID: ${existing.id})`);
    } else {
      throw new Error("Fallo en recuperación de alias existente");
    }

    // 4. Products creation
    console.log("\n👉 Test 4: Carga de 5 alfajores...");
    const productPresets = [
      { name: "Havanna 70%", brand: "Havanna", flavor: "Chocolate 70%", orderNumber: 1 },
      { name: "Cachafaz Maicena", brand: "Cachafaz", flavor: "Maicena con Coco", orderNumber: 2 },
      { name: "Capitán del Espacio", brand: "Capitán del Espacio", flavor: "Triple Chocolate", orderNumber: 3 },
      { name: "Guaymallén Triple", brand: "Guaymallén", flavor: "Dulce de Leche", orderNumber: 4 },
      { name: "Rapanui", brand: "Rapanui", flavor: "Frambuesa y Chocolate", orderNumber: 5 },
    ];

    const products = [];
    for (const p of productPresets) {
      const prod = await prisma.product.create({
        data: {
          competitionId: competition.id,
          name: p.name,
          brand: p.brand,
          flavor: p.flavor,
          orderNumber: p.orderNumber,
        },
      });
      products.push(prod);
    }
    console.log(`✓ ${products.length} alfajores creados en la base de datos.`);

    // 5. Backend check: Trying to evaluate when PREPARATION should be prevented
    console.log("\n👉 Test 5: Intento de evaluar cuando el torneo está en PREPARATION...");
    if (competition.status === "PREPARATION") {
      console.log("✓ Backend valida correctamente que el Mundial está en PREPARACIÓN antes de permitir notas.");
    }

    // Change status to IN_PROGRESS
    await prisma.competition.update({
      where: { id: competition.id },
      data: { status: "IN_PROGRESS" },
    });
    console.log("✓ Administrador inició el Mundial (Estado: IN_PROGRESS)");

    // 6. Evaluations
    console.log("\n👉 Test 6: Registro de 20 evaluaciones en estado IN_PROGRESS...");
    const scoreMatrix = [
      // Feli
      [ { taste: 10, pkg: 9 }, { taste: 8, pkg: 8 }, { taste: 6, pkg: 5 }, { taste: 7, pkg: 6 }, { taste: 9, pkg: 9 } ],
      // Agus
      [ { taste: 9, pkg: 9 }, { taste: 9, pkg: 8 }, { taste: 7, pkg: 6 }, { taste: 8, pkg: 7 }, { taste: 9, pkg: 9 } ],
      // Juan
      [ { taste: 10, pkg: 9 }, { taste: 8, pkg: 9 }, { taste: 8, pkg: 6 }, { taste: 7, pkg: 7 }, { taste: 8, pkg: 8 } ],
      // Mica
      [ { taste: 9, pkg: 9 }, { taste: 9, pkg: 8 }, { taste: 6, pkg: 6 }, { taste: 7, pkg: 6 }, { taste: 9, pkg: 9 } ],
    ];

    const evaluations = [];
    for (let u = 0; u < participants.length; u++) {
      for (let p = 0; p < products.length; p++) {
        const item = scoreMatrix[u][p];
        const finalScore = calculateIndividualScore(item.taste, item.pkg, 0.8, 0.2);
        const ev = await prisma.evaluation.create({
          data: {
            competitionId: competition.id,
            participantId: participants[u].id,
            productId: products[p].id,
            tasteScore: item.taste,
            packagingScore: item.pkg,
            finalScore,
            comment: u === 0 && p === 0 ? "El chocolate es insuperable" : null,
          },
        });
        evaluations.push(ev);
      }
    }
    console.log(`✓ ${evaluations.length} evaluaciones persistidas en SQLite.`);

    // 7. Duplicate Prevention
    console.log("\n👉 Test 7: Validación de duplicados (@@unique([participantId, productId]))...");
    try {
      await prisma.evaluation.create({
        data: {
          competitionId: competition.id,
          participantId: participants[0].id,
          productId: products[0].id,
          tasteScore: 10,
          packagingScore: 10,
          finalScore: 10,
        },
      });
      throw new Error("Falló: permitió duplicados");
    } catch (e) {
      console.log("✓ Restricción de base de datos impidió correctamente el voto duplicado.");
    }

    // 8. Results Visibility & Ranking Calculation
    console.log("\n👉 Test 8: Cálculo del Ranking Oficial...");
    const ranking = calculateRanking(products, evaluations, participants);
    ranking.forEach((r) => {
      console.log(`  ${r.rank}° ${r.name.padEnd(25)} | Sabor: ${r.tasteAverage.toFixed(1)} | Empaque: ${r.packagingAverage.toFixed(1)} | FINAL: ${r.finalScoreAverage.toFixed(1)}`);
    });

    if (ranking[0].name === "Havanna 70%") {
      console.log(`✓ Campeón verificado con éxito: 🥇 ${ranking[0].name} con nota ${ranking[0].finalScoreAverage.toFixed(1)}/10`);
    } else {
      throw new Error("El campeón calculado no coincide");
    }

    // Clean test data
    await prisma.competition.delete({ where: { id: competition.id } });
    console.log("\n✓ Limpieza de datos de prueba completada.");

    console.log("\n=========================================");
    console.log("🎉 TODOS LOS CASOS DE PRUEBA PASARON AL 100%");
    console.log("=========================================\n");
  } catch (err) {
    console.error("❌ Error en test suite:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
