import { NextResponse } from "next/server";
import { getRandomPickupLines } from "@/data/backupContent";
import {
  getPickupLinesFromPool,
  savePickupLinesToPool,
} from "@/lib/communityPool";
import { generateWithGPT, parseJsonFromAI } from "@/lib/openai";

const prompt = `You are a Filipino pick up line writer. Your lines are funny, creative, and very relatable to Filipino life and culture.

PICK UP LINE STYLES — rotate between all three styles in your 5 results:

STYLE 1 — PUNS (Filipino word play):
- Use Filipino or Taglish words that sound like something else
- The pun should make someone groan and laugh at the same time
- Examples of the EXACT format:
  "Ikaw ba ay PLDT? Kasi kahit galit ako sayo, hindi kita matanggalan."
  "Ikaw ba ay rice cooker? Kasi init na init ako sa'yo at ayaw kitang patayin."
  "Ikaw ba ay load? Kasi palagi kitang kailangan at mabilis ka namang maubos."

STYLE 2 — HUGOT (emotional Filipino irony):
- Sounds romantic at first but ends with a funny Filipino reality
- References Filipino daily life: jeep, signal, brownout, utang, traffic
- Examples:
  "Sana ang puso ko ay parang Jollibee — always open para sayo kahit 3am."
  "Tulad ng jeepney, palagi may puwang para sayo sa puso ko. Medyo siksikan lang."
  "Parang internet connection sa probinsya — mabagal pero dedicated sayo."

STYLE 3 — NONSENSE (absurdly specific, very Filipino):
- Completely random comparison that somehow makes sense
- More absurd = funnier
- Examples:
  "Kamukha mo yung ulam ko kanina. Hindi kita malimutan kahit gusto ko."
  "Parang sukli sa tindahan — hindi kita inaasahan pero masaya ako na nandiyan ka."
  "Nararamdaman ko ang iyong presensya tulad ng amoy ng adobo — kahit nasaan ako, naiisip kita."

FORMAT RULES:
- Each line is 1 to 2 sentences maximum
- Filipino or Taglish — no full English lines
- End each line naturally — no exclamation marks needed
- The funnier the better — aim for the reader to cringe and laugh at the same time
- Never be rude, sexual, or offensive

WHAT TO AVOID:
- Do not copy the examples above
- Do not use "Ikaw ba ay isang bituin" — overused
- Do not use "Nandito na ang sagot sa aking panalangin" — too cheesy
- Do not use English pick up lines translated directly to Filipino
- Do not make them too long

Generate exactly 5 Filipino pick up lines using a mix of all three styles. Return ONLY a valid JSON array of exactly 5 strings with no markdown and no explanation.`;

function buildFiveLines(communityLines: string[]): string[] {
  const needed = Math.max(0, 5 - communityLines.length);
  const staticLines = needed > 0 ? getRandomPickupLines(needed) : [];
  return [...communityLines, ...staticLines].slice(0, 5);
}

export async function GET() {
  try {
    const result = await generateWithGPT(prompt);
    const parsedLines = parseJsonFromAI(result).filter(
      (item): item is string => typeof item === "string",
    );

    if (parsedLines.length === 0) {
      throw new Error("Empty AI response");
    }

    void savePickupLinesToPool(parsedLines, "mixed");

    return NextResponse.json({
      lines: parsedLines.slice(0, 5),
      usingBackup: false,
      source: "ai",
    });
  } catch {
    const communityLines = await getPickupLinesFromPool(5);
    const lines = buildFiveLines(communityLines);

    void savePickupLinesToPool(lines, "mixed");

    return NextResponse.json(
      {
        lines,
        usingBackup: true,
        source: communityLines.length >= 3 ? "community" : "static",
        message:
          communityLines.length >= 3
            ? "Pick up lines mula sa komunidad!"
            : "Backup pick up lines muna!",
      },
      { status: 200 },
    );
  }
}
