import { NextResponse } from "next/server";
import { BACKUP_SUPERPOWERS, getRandomBackups } from "@/data/backupContent";
import {
  getSuperPowersFromPool,
  saveSuperPowersToPool,
} from "@/lib/communityPool";
import { generateWithGPT, parseJsonFromAI } from "@/lib/openai";

const AI_INSTRUCTIONS =
  'Generate exactly 5 funny Filipino superpowers, each with a ridiculous side effect. Write each as one sentence: the amazing superpower followed by the funny consequence. Rules: write in casual Filipino or Tagalog, the superpower sounds incredible at first but the side effect makes it funny or useless, very relatable to Filipino daily life and culture, return ONLY a valid JSON array of exactly 5 strings with no other text. Examples: ["Nakakalipad ka. Pero may ads muna bago ka lumipad.", "Hindi ka natatanda. Pero lahat ng ex mo kasal na.", "Palagi kang panalo sa argue. Pero wala ka nang kaibigan."] Generate 5 completely new and original ones.';

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
