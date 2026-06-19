import content from "@/data/content.json";

type LuckyColor = {
  name: string;
  hex: string;
  english: string;
};

type ContentData = {
  predictions: string[];
  luckyColors: LuckyColor[];
};

export type DailyContent = {
  prediction: string;
  luckyColor: LuckyColor;
  luckyNumber: number;
  dayIndex: number;
};

const FALLBACK_PREDICTION = "Magiging maayos ang lahat. Sana.";
const FALLBACK_COLOR: LuckyColor = {
  name: "Berde",
  hex: "#27AE60",
  english: "Green",
};

function loadContent(): ContentData | null {
  try {
    if (!content?.predictions?.length || !content?.luckyColors?.length) {
      throw new Error("Invalid content data");
    }

    return content as ContentData;
  } catch {
    return null;
  }
}

export function getDayOfYear(date: Date = new Date()): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diffMs = date.getTime() - startOfYear.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
}

export function getTodayContent(date: Date = new Date()): DailyContent {
  const dayIndex = getDayOfYear(date);
  const luckyNumber = ((dayIndex * 7 + 13) % 99) + 1;
  const data = loadContent();

  if (!data) {
    return {
      prediction: FALLBACK_PREDICTION,
      luckyColor: FALLBACK_COLOR,
      luckyNumber,
      dayIndex,
    };
  }

  try {
    const prediction = data.predictions[dayIndex % data.predictions.length];
    const luckyColor = data.luckyColors[dayIndex % data.luckyColors.length];

    if (!prediction || !luckyColor) {
      throw new Error("Missing daily content entry");
    }

    return {
      prediction,
      luckyColor,
      luckyNumber,
      dayIndex,
    };
  } catch {
    return {
      prediction: FALLBACK_PREDICTION,
      luckyColor: FALLBACK_COLOR,
      luckyNumber,
      dayIndex,
    };
  }
}
