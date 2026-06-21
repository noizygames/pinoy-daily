import { NextResponse } from "next/server";
import { generateWithGPT, parseJsonFromAI } from "@/lib/openai";
import { savePickupLinesToPool } from "@/lib/communityPool";
import { getRandomStructuredPickupLines } from "@/data/backupContent";

const CATEGORY_CONTEXT: Record<string, string> = {
  classic:
    "Classic Pinoy objects — jeepney, trike, load, sari-sari store, palengke, bangko",
  food: "Filipino food and drinks — adobo, kanin, siomai, lumpia, mami, lugaw, halo-halo, taho",
  tech: "Technology — phone, WiFi, internet, battery, signal, apps, charging",
  work: "Work and money — sweldo, meeting, OT, boss, deadline, application, interview",
  cringe:
    "Absurd everyday objects — tsinelas, electric fan, basura, silya, bumbero, bangko",
  "plot-twist":
    "Starts romantic then ends with Filipino reality — price increase, traffic, signal loss, pagod",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "classic";

  const categoryLabel =
    CATEGORY_CONTEXT[category] ?? CATEGORY_CONTEXT.classic!;

  const prompt = `Ikaw ay isang Filipino pick up line writer na espesyalista sa nakakaaliw at nakakatawang mga linya.

CATEGORY: ${categoryLabel}

DALAWANG BAHAGI ng bawat pick up line:

BAHAGI 1 — THE LINE (setup):
- Isang tanong o pahayag tungkol sa isang bagay
- Template: "[Bagay] ka ba?" o "[Bagay] ka?"
- Dapat mukhang sincere o romantic sa simula
- Isang sentence lang

BAHAGI 2 — THE PUNCHLINE (twist):
- Nagsisimula sa "Kasi..."
- Nagpapaliwanag kung bakit ang paghahalintulad
- Dapat nakakatawa — either nakakaaliw, nakakakilig, o nakakaiyak ng tawa
- Para sa PLOT TWIST category: dapat masakit pero nakakatawa ang ending

PINAKA-EPEKTIBONG FORMAT:
Setup: "Sweldo ka ba?"
Punchline: "Kasi buwan-buwan kitang hinihintay. Pero pagdating mo, wala ka agad."

Setup: "WiFi ka ba?"
Punchline: "Kasi malakas ang connection natin. Minsan."

Setup: "Adobo ka ba?"
Punchline: "Kasi gusto kita ngayon, bukas, at sa susunod pang tatlong araw."

RULES:
- Isulat sa Filipino o Taglish
- Family-friendly at hindi offensive
- Ang punchline ay dapat hindi predictable
- Para sa CLASSIC at FOOD: mas romantic at wholesome ang ending
- Para sa TECH at WORK: pwedeng slightly relatable sa struggles
- Para sa CRINGE: mas absurd at walang kwenta pero nakakatawa
- Para sa PLOT TWIST: magsimula sa romantic, tapusin ng brutal na katotohanan
- Huwag gamitin ang mga halimbawa sa itaas
- Huwag gumamit ng "bituin" o "buwan" — overused na

Generate exactly 5 pick up lines. Return ONLY a JSON array of 5 objects:
[
  { "line": "setup sentence", "punchline": "kasi... explanation" }
]

No markdown. No explanation. Only the JSON array.`;

  try {
    const result = await generateWithGPT(prompt, 1200);
    const parsed = parseJsonFromAI(result) as Array<{
      line: string;
      punchline: string;
    }>;

    const valid = parsed.filter(
      (item) =>
        item &&
        typeof item.line === "string" &&
        typeof item.punchline === "string",
    );

    if (valid.length === 0) throw new Error("Invalid structure");

    void savePickupLinesToPool(
      valid.map((item) => `${item.line} ${item.punchline}`),
      category,
    );

    return NextResponse.json({
      lines: valid,
      usingBackup: false,
      source: "ai",
    });
  } catch {
    const backupLines = getRandomStructuredPickupLines(5, category);

    return NextResponse.json(
      {
        lines: backupLines.map((l) => ({
          line: l.line,
          punchline: l.punchline,
        })),
        usingBackup: true,
        source: "static",
        message: "Backup lines muna!",
      },
      { status: 200 },
    );
  }
}
