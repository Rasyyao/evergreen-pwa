// Single source of truth for dummy data. Swap these functions for real
// API/Supabase calls later without touching consuming components.

export type DeviceStatus = "connected" | "disconnected";

export type Device = {
  id: string;
  status: DeviceStatus;
  battery: number;
};

export type LandCondition = {
  moisturePct: number;
  soilTempC: number;
  ph: number;
  lightLevel: "Rendah" | "Sedang" | "Tinggi";
};

export type ActivityEvent = {
  time: string;
  action: string;
  detail: string;
};

export type HomeData = {
  device: Device;
  landCondition: LandCondition;
  activityHistory: ActivityEvent[];
};

export type Severity = "Rendah" | "Sedang" | "Tinggi";

export type AnalisisEntry = {
  id: string;
  species: string;
  datetime: string;
  confidence: number;
  severity: Severity;
  thumbnail: string;
  imageUrl: string;
  explanation: string;
  recommendation: {
    type: "Pestisida" | "Herbisida";
    doseMl: number;
  };
};

export type ActivityPeriod = "harian" | "mingguan" | "bulanan";

export type ActivityLogEntry = {
  time: string;
  type: "Herbisida" | "Pestisida" | "Monitoring";
  target: string;
  volumeL: number;
};

export type ActivityLog = {
  period: ActivityPeriod;
  summary: {
    totalAreaHa: number;
    totalSprayCount: number;
    pesticideL: number;
    herbicideL: number;
  };
  entries: ActivityLogEntry[];
};

const homeData: HomeData = {
  device: {
    id: "EVERGREEN-01",
    status: "connected",
    battery: 85,
  },
  landCondition: {
    moisturePct: 32,
    soilTempC: 27,
    ph: 6.4,
    lightLevel: "Tinggi",
  },
  activityHistory: [
    { time: "08:25", action: "Penyemprotan Gulma", detail: "Herbisida 0.8L" },
    { time: "08:10", action: "Penyemprotan Hama", detail: "Pestisida 0.6L" },
    { time: "07:55", action: "Monitoring Lahan", detail: "Selesai" },
    { time: "07:30", action: "Monitoring Lahan", detail: "Selesai" },
  ],
};

const analisisList: AnalisisEntry[] = [
  {
    id: "an001",
    species: "Rumput Teki",
    datetime: "2026-09-10 08:20",
    confidence: 0.87,
    severity: "Sedang",
    thumbnail: "/dummy/img1_thumb.svg",
    imageUrl: "/dummy/img1_boxed.svg",
    explanation:
      "Terdeteksi Rumput Teki (Cyperus rotundus) dengan tingkat keyakinan 87%. Gulma ini dikenal sulit dikendalikan karena sistem rimpang di bawah tanah yang menyebar cepat dan bersaing kuat dengan tanaman budidaya untuk nutrisi dan air.",
    recommendation: { type: "Herbisida", doseMl: 50 },
  },
  {
    id: "an002",
    species: "Bayam Duri",
    datetime: "2026-09-10 07:55",
    confidence: 0.79,
    severity: "Tinggi",
    thumbnail: "/dummy/img2_thumb.svg",
    imageUrl: "/dummy/img2_boxed.svg",
    explanation:
      "Terdeteksi Bayam Duri (Amaranthus spinosus) dengan tingkat keyakinan 79%. Gulma berduri ini tumbuh cepat pada lahan lembap dan dapat menekan pertumbuhan tanaman muda jika dibiarkan menyebar.",
    recommendation: { type: "Herbisida", doseMl: 65 },
  },
  {
    id: "an003",
    species: "Wereng Coklat",
    datetime: "2026-09-09 16:40",
    confidence: 0.92,
    severity: "Tinggi",
    thumbnail: "/dummy/img3_thumb.svg",
    imageUrl: "/dummy/img3_boxed.svg",
    explanation:
      "Terdeteksi hama Wereng Coklat (Nilaparvata lugens) dengan tingkat keyakinan 92%. Hama ini menghisap cairan batang padi dan berpotensi menyebabkan gejala 'hopperburn' bila populasinya tidak segera dikendalikan.",
    recommendation: { type: "Pestisida", doseMl: 40 },
  },
  {
    id: "an004",
    species: "Rumput Grinting",
    datetime: "2026-09-09 09:12",
    confidence: 0.68,
    severity: "Rendah",
    thumbnail: "/dummy/img4_thumb.svg",
    imageUrl: "/dummy/img4_boxed.svg",
    explanation:
      "Terdeteksi Rumput Grinting (Cynodon dactylon) dengan tingkat keyakinan 68%. Populasi masih tergolong rendah sehingga pengendalian dini dapat mencegah penyebaran lebih lanjut.",
    recommendation: { type: "Herbisida", doseMl: 30 },
  },
];

const activityLogs: Record<ActivityPeriod, ActivityLog> = {
  harian: {
    period: "harian",
    summary: {
      totalAreaHa: 2.4,
      totalSprayCount: 2,
      pesticideL: 1.4,
      herbicideL: 1.6,
    },
    entries: [
      { time: "08:25", type: "Herbisida", target: "Gulma", volumeL: 0.8 },
      { time: "08:10", type: "Pestisida", target: "Hama", volumeL: 0.6 },
      { time: "07:55", type: "Monitoring", target: "Lahan", volumeL: 0 },
    ],
  },
  mingguan: {
    period: "mingguan",
    summary: {
      totalAreaHa: 12.8,
      totalSprayCount: 11,
      pesticideL: 6.2,
      herbicideL: 7.9,
    },
    entries: [
      { time: "Sen 08:25", type: "Herbisida", target: "Gulma", volumeL: 0.8 },
      { time: "Sel 09:10", type: "Pestisida", target: "Hama", volumeL: 0.9 },
      { time: "Rab 07:55", type: "Monitoring", target: "Lahan", volumeL: 0 },
      { time: "Kam 08:40", type: "Herbisida", target: "Gulma", volumeL: 1.1 },
      { time: "Jum 08:05", type: "Pestisida", target: "Hama", volumeL: 0.7 },
    ],
  },
  bulanan: {
    period: "bulanan",
    summary: {
      totalAreaHa: 48.5,
      totalSprayCount: 39,
      pesticideL: 24.6,
      herbicideL: 29.3,
    },
    entries: [
      { time: "01 Sep", type: "Herbisida", target: "Gulma", volumeL: 3.2 },
      { time: "08 Sep", type: "Pestisida", target: "Hama", volumeL: 2.8 },
      { time: "15 Sep", type: "Monitoring", target: "Lahan", volumeL: 0 },
      { time: "22 Sep", type: "Herbisida", target: "Gulma", volumeL: 3.6 },
      { time: "29 Sep", type: "Pestisida", target: "Hama", volumeL: 2.1 },
    ],
  },
};

export function getHomeData(): HomeData {
  return homeData;
}

export function getRandomAnalisisId(): string {
  return analisisList[Math.floor(Math.random() * analisisList.length)].id;
}

export function getActivityLog(period: ActivityPeriod): ActivityLog {
  return activityLogs[period];
}

export const severityStyles: Record<
  Severity,
  { badge: string; dot: string }
> = {
  Rendah: {
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
    dot: "bg-emerald-500",
  },
  Sedang: {
    badge: "bg-amber-50 text-amber-700 border border-amber-200/80",
    dot: "bg-amber-500",
  },
  Tinggi: {
    badge: "bg-rose-50 text-rose-700 border border-rose-200/80",
    dot: "bg-rose-500",
  },
};
