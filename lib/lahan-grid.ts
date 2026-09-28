import type { Lahan, LahanStatus, LatLng, ZonePrediction } from "./mock-data";

export type GridDataSources = {
  moisturePct: number;
  soilTempC: number;
  ph: number;
  sensorScan: string;
};

export type GridPreventionInfo = {
  immediateAction: string;
  actionType: "Pestisida" | "Herbisida" | "Monitoring" | "Pemeliharaan";
  urgency: "Segera" | "Dalam 3 Hari" | "Dalam 1 Minggu" | "Rutin";
  preventionTips: string[];
};

export type GridPredictionDetail = {
  threatName: string;
  category: "Hama" | "Penyakit" | "Gulma" | "Nutrisi" | "Sehat";
  predictabilityPct: number;
  riskLevel: LahanStatus;
  dataSources: GridDataSources;
  prevention: GridPreventionInfo;
};

export type LahanGridCell = {
  id: string;
  gridCode: string; // e.g. "R0-C3"
  status: LahanStatus;
  moisturePct: number;
  soilTempC: number;
  /** [southWest, northEast] corners of the square cell. */
  bounds: [LatLng, LatLng];
  /** Single representative point at the center of the cell. */
  center: LatLng;
  /** Prediction insights & prevention for this specific cell */
  prediction: GridPredictionDetail;
};

function isPointInPolygon([lat, lng]: LatLng, polygon: LatLng[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [latI, lngI] = polygon[i];
    const [latJ, lngJ] = polygon[j];
    const intersects =
      latI > lat !== latJ > lat &&
      lng < ((lngJ - lngI) * (lat - latI)) / (latJ - latI) + lngI;
    if (intersects) inside = !inside;
  }
  return inside;
}

function buildGridPrediction(
  lahan: Lahan,
  status: LahanStatus,
  cellIndex: number,
  moisture: number
): GridPredictionDetail {
  const matchingPred = lahan.zonePredictions?.find((p) => p.zoneStatus === status);

  if (status === "bahaya") {
    const baseConf = matchingPred ? matchingPred.confidence : 0.9;
    const variation = ((cellIndex * 7) % 7) - 3; // -3 to +3
    const predictabilityPct = Math.min(98, Math.max(82, Math.round(baseConf * 100) + variation));
    const threat = matchingPred?.threat ?? "Hama Penggerek Batang";
    const action = matchingPred?.action ?? "Lakukan penyemprotan insektisida sistemik darurat";
    const isPadi = lahan.komoditas.toLowerCase().includes("padi");

    return {
      threatName: threat,
      category: "Hama",
      predictabilityPct,
      riskLevel: "bahaya",
      dataSources: {
        moisturePct: moisture,
        soilTempC: lahan.condition.soilTempC + ((cellIndex % 3) - 1),
        ph: lahan.condition.ph,
        sensorScan: isPadi
          ? "Scan Robot: Koloni nimfa & anomali getah kecoklatan pada pelepah pangkal batang."
          : "Scan Robot: Akumulasi serangga hama aktif & anomali klorofil pelepah daun (NDVI < 0.38).",
      },
      prevention: {
        immediateAction: action,
        actionType: (matchingPred?.actionType as any) ?? "Pestisida",
        urgency: matchingPred?.urgency ?? "Segera",
        preventionTips: isPadi
          ? [
              "Terapkan pengairan berselang (intermittent irrigation) untuk memutus kelembapan mikro koloni",
              "Pasang lampu perangkap (light trap) di pematang sawah pada malam hari",
              "Kurangi dosis pupuk Urea (Nitrogen) berlebih yang merangsang perkembangbiakan hama",
            ]
          : [
              "Pasang perangkap lekat kuning (yellow sticky trap) 40 unit/ha",
              "Semprot air bertekanan halus pada pagi hari untuk merontokkan koloni hama",
              "Gunakan mulsa plastik perak untuk memantulkan spektrum cahaya yang dibenci hama",
            ],
      },
    };
  }

  if (status === "waspada") {
    const baseConf = matchingPred ? matchingPred.confidence : 0.78;
    const variation = ((cellIndex * 5) % 7) - 3;
    const predictabilityPct = Math.min(88, Math.max(70, Math.round(baseConf * 100) + variation));
    const threat = matchingPred?.threat ?? "Gulma Liar & Defisiensi Hara";
    const action = matchingPred?.action ?? "Lakukan penyiangan manual dan penyesuaian nutrisi";
    const isWeed = threat.toLowerCase().includes("rumput") || threat.toLowerCase().includes("bayam") || threat.toLowerCase().includes("teki");

    return {
      threatName: threat,
      category: isWeed ? "Gulma" : "Hama",
      predictabilityPct,
      riskLevel: "waspada",
      dataSources: {
        moisturePct: moisture,
        soilTempC: lahan.condition.soilTempC,
        ph: lahan.condition.ph,
        sensorScan: isWeed
          ? "Scan Robot: Deteksi kerapatan tajuk gulma pengganggu 15-22 batang/m² bersaing hara."
          : "Scan Robot: Deteksi bercak gerek larva muda & anomali spektral daun awal.",
      },
      prevention: {
        immediateAction: action,
        actionType: (matchingPred?.actionType as any) ?? (isWeed ? "Herbisida" : "Monitoring"),
        urgency: matchingPred?.urgency ?? "Dalam 3 Hari",
        preventionTips: isWeed
          ? [
              "Cabut gulma hingga ke umbi akar sebelum fase pembungaan",
              "Pertahankan ketinggian air petak sawah 3-5 cm untuk menekan dormansi biji gulma",
              "Gunakan mulsa organik jerami pada petak bedengan terbuka",
            ]
          : [
              "Pasang feromon trap untuk memantau populasi ngengat dewasa",
              "Semprot bio-insektisida ramah lingkungan (Bacillus thuringiensis) di waktu sore",
              "Sanitasi gulma liar inang di pematang pembatas petak",
            ],
      },
    };
  }

  // "aman" / sehat
  const variation = ((cellIndex * 3) % 5);
  const predictabilityPct = 95 + variation; // 95 - 99%

  return {
    threatName: "Kondisi Optimal (Tanaman Sehat)",
    category: "Sehat",
    predictabilityPct,
    riskLevel: "aman",
    dataSources: {
      moisturePct: moisture,
      soilTempC: lahan.condition.soilTempC,
      ph: lahan.condition.ph,
      sensorScan: "Scan Robot: Kanopi hijau merata, indeks vegetasi NDVI 0.84 (Optimal), bebas anomali hama.",
    },
    prevention: {
      immediateAction: "Pertahankan jadwal irigasi berkala dan pemupukan berimbang",
      actionType: "Pemeliharaan",
      urgency: "Rutin",
      preventionTips: [
        "Pertahankan sirkulasi air dan kelembapan tanah di rentang 35% - 45%",
        "Lestarikan predator alami musuh hama seperti laba-laba pemburu (Lycosa sp.)",
        "Jadwalkan pemantauan rutin robot mapping 2 kali seminggu",
      ],
    },
  };
}

/**
 * Tiles the lahan's bounding box into a `resolution` x `resolution` grid of
 * square cells, keeping only the cells whose center falls inside the real
 * boundary polygon, and assigns each kept cell a single status/point from
 * the lahan's `zonePattern` (cycled round-robin, row-major order).
 */
export function computeLahanGrid(lahan: Lahan, resolution = 6): LahanGridCell[] {
  const lats = lahan.boundary.map(([lat]) => lat);
  const lngs = lahan.boundary.map(([, lng]) => lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latStep = (maxLat - minLat) / resolution;
  const lngStep = (maxLng - minLng) / resolution;

  const cells: LahanGridCell[] = [];
  let patternIndex = 0;

  for (let row = 0; row < resolution; row++) {
    for (let col = 0; col < resolution; col++) {
      const sw: LatLng = [minLat + row * latStep, minLng + col * lngStep];
      const ne: LatLng = [minLat + (row + 1) * latStep, minLng + (col + 1) * lngStep];
      const center: LatLng = [(sw[0] + ne[0]) / 2, (sw[1] + ne[1]) / 2];

      if (!isPointInPolygon(center, lahan.boundary)) continue;

      const status = lahan.zonePattern[patternIndex % lahan.zonePattern.length];
      const moisturePct =
        status === "bahaya"
          ? 16 + ((patternIndex * 3) % 6)
          : status === "waspada"
            ? 27 + ((patternIndex * 4) % 6)
            : 36 + ((patternIndex * 5) % 9);

      const gridCode = `R${row}-C${col}`;
      const prediction = buildGridPrediction(lahan, status, patternIndex, moisturePct);

      cells.push({
        id: `${lahan.id}-r${row}c${col}`,
        gridCode,
        status,
        moisturePct,
        soilTempC: lahan.condition.soilTempC,
        bounds: [sw, ne],
        center,
        prediction,
      });
      patternIndex++;
    }
  }

  return cells;
}
