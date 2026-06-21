import { NextResponse } from "next/server";
import { generateWithGPT, parseJsonFromAI } from "@/lib/openai";
import { saveExcusesToPool } from "@/lib/communityPool";
import { getRandomStructuredExcuses } from "@/data/backupContent";

const EXCUSE_CATEGORIES: Record<string, string> = {
  "late-work": "Late for Work (nalate sa trabaho)",
  "late-school": "Late for School (nalate sa school)",
  "no-reply": "Didn't Reply (hindi nagreply sa text o tawag)",
  "no-money": "No Money / Can't Pay Debt (walang pera o hindi nakabayad ng utang)",
  absent: "Absent (absent sa trabaho, school, o event)",
  "missed-deadline":
    "Missed Deadline (hindi natapos ang trabaho o assignment)",
  breakup:
    "Avoiding Someone / Breakup Excuse (iniiwasan ang isang tao)",
  forgot: "Forgot Something (nakalimutang pumunta o gumawa ng bagay)",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "late-work";
  const situation = searchParams.get("situation") || "";

  const categoryLabel = EXCUSE_CATEGORIES[category] || "General Excuse";

  const prompt = `Ikaw ay isang Filipino humor writer na eksperto sa paggawa ng nakakatawang excuses.

CATEGORY: ${categoryLabel}
${situation ? `SPECIFIC SITUATION: ${situation}` : ""}

FORMULA — rotate among these three for your 3 excuses:

FORMULA 1 — Normal Situation + Overreaction + Absurd Conclusion:
Halimbawa: "Nalate ako kasi nawalan ako ng isang medyas. Hinanap ko siya sa buong bahay. Hindi ko rin nakita ang motivation ko."

FORMULA 2 — Good Intention + Unexpected Problem + Ridiculous Ending:
Halimbawa: "Papasok na sana ako. Pero nahiga lang ako saglit. Nag-fast travel ako papuntang tanghali."

FORMULA 3 — Everyday Filipino Problem + Exaggeration:
Halimbawa: "Hindi ako nakapagtrabaho ngayon. May kapitbahay kaming nag-videoke. Ginawa ko na lang soundtrack ng buhay ko."

RULES:
- Isulat sa Tagalog o Taglish
- Family-friendly, walang pulitika o relihiyon
- Ang simula ay dapat mukhang totoo at believable
- Ang ending ay absurd at nakakatawa
- Maximum 3 sentences bawat excuse
- Dapat maging relatable sa mga Pilipino
- Parang viral meme caption ang dating

FORMAT — return a JSON array of exactly 3 objects:
[
  {
    "situation": "short phrase describing what happened (e.g. Nalate ako)",
    "excuse": "the full 2-3 sentence excuse"
  }
]

No markdown. No explanation. Only the JSON array.`;

  try {
    const result = await generateWithGPT(prompt);
    const parsed = parseJsonFromAI(result) as Array<{
      situation: string;
      excuse: string;
    }>;

    const valid = parsed.filter(
      (item) =>
        item &&
        typeof item.situation === "string" &&
        typeof item.excuse === "string",
    );

    if (valid.length === 0) throw new Error("Invalid response structure");

    void saveExcusesToPool(valid.map((e) => e.excuse));

    return NextResponse.json({
      excuses: valid,
      usingBackup: false,
      source: "ai",
    });
  } catch {
    const backupExcuses = getRandomStructuredExcuses(3, category);

    return NextResponse.json(
      {
        excuses: backupExcuses.map((e) => ({
          situation: e.situation,
          excuse: e.excuse,
        })),
        usingBackup: true,
        source: "static",
        message: "Backup excuses muna!",
      },
      { status: 200 },
    );
  }
}
