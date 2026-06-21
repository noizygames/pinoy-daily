import { NextResponse } from "next/server";
import { BACKUP_SUPERPOWERS, getRandomBackups } from "@/data/backupContent";
import {
  getSuperPowersFromPool,
  saveSuperPowersToPool,
} from "@/lib/communityPool";
import { generateWithGPT, parseJsonFromAI } from "@/lib/openai";

const AI_INSTRUCTIONS =`You are a Filipino humor writer creating funny superpower descriptions.

THE FORMAT (strict):
- One sentence only.
- First half: an amazing superpower that sounds genuinely useful or cool.
- Second half (after a period): the side effect that makes it useless, annoying, or very Filipino.
- The period between them is the punchline pause — use it well.

WHAT MAKES IT WORK:
- "Nakakalipad ka. Pero may ads muna bago ka lumipad." ← Filipino internet culture
- "Hindi ka natatanda. Pero lahat ng ex mo, kasal na." ← personal and painful
- "Invisible ka pag gusto mo. Pero nananatili ang amoy mo." ← specific and absurd
- "Palagi kang panalo sa argue. Pero wala ka nang kaibigan." ← social consequence
- "Nakakaalam ka ng future. Pero hindi mo mababago." ← existential Filipino fatalism

SIDE EFFECT RULES:
- Must be specifically Filipino whenever possible (PLDT, brownout, jeep, utang, pakikisama, family).
- Or universally relatable but extra specific (ads, loading, signal, battery).
- The side effect should feel like a fair punishment or ironic consequence.
- Never just say "pero may side effect" — be specific about what the side effect IS.

WHAT TO AVOID:
- Do not use the same structure twice in one batch.
- Do not make the side effect worse than having no power at all.
- Do not be dark or violent.
- Do not repeat the examples above.

Generate exactly 5 completely new and original superpowers. Return ONLY a valid JSON array of 5 strings.`;
  //'Generate exactly 5 funny Filipino superpowers, each with a ridiculous side effect. Write each as one sentence: the amazing superpower followed by the funny consequence. Rules: write in casual Filipino or Tagalog, the superpower sounds incredible at first but the side effect makes it funny or useless, very relatable to Filipino daily life and culture, return ONLY a valid JSON array of exactly 5 strings with no other text. Examples: ["Nakakalipad ka. Pero may ads muna bago ka lumipad.", "Hindi ka natatanda. Pero lahat ng ex mo kasal na.", "Palagi kang panalo sa argue. Pero wala ka nang kaibigan."] Generate 5 completely new and original ones.';

export async function GET() {
  try {
    const result = await generateWithGPT(AI_INSTRUCTIONS);
    const parsedArray = parseJsonFromAI(result);
    const superpowers = parsedArray.filter(
      (item): item is string => typeof item === "string",
    );

    void saveSuperPowersToPool(superpowers);

    return NextResponse.json({
      superpowers,
      usingBackup: false,
    });
  } catch {
    const communitySuperpowers = await getSuperPowersFromPool(5);

    if (communitySuperpowers.length >= 5) {
      return NextResponse.json(
        {
          superpowers: communitySuperpowers,
          usingBackup: true,
          source: "community",
        },
        { status: 200 },
      );
    }

    const staticSuperpowers = getRandomBackups(BACKUP_SUPERPOWERS, 5);
    const mixed = [...communitySuperpowers, ...staticSuperpowers].slice(0, 5);

    return NextResponse.json(
      { superpowers: mixed, usingBackup: true, source: "static" },
      { status: 200 },
    );
  }
}
