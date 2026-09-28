import type { Lahan, LahanStatus, LatLng } from "./mock-data";

export type LahanGridCell = {
  id: string;
  status: LahanStatus;
  moisturePct: number;
  /** [southWest, northEast] corners of the square cell. */
  bounds: [LatLng, LatLng];
  /** Single representative point at the center of the cell. */
  center: LatLng;
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
      cells.push({
        id: `${lahan.id}-r${row}c${col}`,
        status,
        moisturePct:
          status === "bahaya"
            ? 16 + ((patternIndex * 3) % 6)
            : status === "waspada"
              ? 27 + ((patternIndex * 4) % 6)
              : 36 + ((patternIndex * 5) % 9),
        bounds: [sw, ne],
        center,
      });
      patternIndex++;
    }
  }

  return cells;
}
