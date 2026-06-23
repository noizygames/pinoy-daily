import { NextResponse } from "next/server";
import { generateWithGPT } from "@/lib/openai";
import { supabase } from "@/lib/supabase";
import {
  COMPATIBILITY_CATEGORIES,
  getRandomFallbackLines,
} from "@/lib/compatibility";

function getCategoryPrompts(percentage: number): Record<string, string> {
  return {
    disaster: `Compatibility score: ${percentage}% — DISASTER category (0-20%).
These two names are completely incompatible. The humor should be brutally honest but funny.
Style: Deadpan Filipino humor. Like a fortune teller who has given up hope for this couple.`,

    friendzone: `Compatibility score: ${percentage}% — FRIEND ZONE category (21-40%).
These two are stuck in the friend zone. The humor should be about hopeless but relatable romantic situations.
Style: Sympathetic but funny. Like a tita who feels sorry for them.`,

    mixed: `Compatibility score: ${percentage}% — MIXED SIGNALS category (41-60%).
These two send confusing signals to each other. The humor should be about Filipino relationship confusion and overthinking.
Style: Confused and relatable. Like a friend giving contradictory advice.`,

    goodmatch: `Compatibility score: ${percentage}% — GOOD MATCH category (61-80%).
These two have good compatibility but something small is in the way. The humor should be encouraging but with a funny catch.
Style: Supportive but realistic. Like a cheerful ninong giving advice.`,

    soulmates: `Compatibility score: ${percentage}% — SOULMATES category (81-100%).
These two are highly compatible but Filipino reality gets in the way. The humor should be romantic but end with a funny twist.
Style: Kilig then unexpected reality check. Like a teleserye that suddenly becomes a comedy.`,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name1 = searchParams.get("name1") || "";
  const name2 = searchParams.get("name2") || "";
  const percentage = parseInt(searchParams.get("percentage") || "50", 10);
  const categoryParam = searchParams.get("category") || "mixed";
  const categoryId =
    COMPATIBILITY_CATEGORIES.find((cat) => cat.id === categoryParam)?.id ||
    "mixed";

  if (!name1 || !name2) {
    return NextResponse.json({ error: "Names are required" }, { status: 400 });
  }

  const categoryPrompts = getCategoryPrompts(percentage);

  const categoryContext = {
    disaster: `DISASTER (${percentage}%) — completely incompatible. Brutally honest but funny Filipino humor. Like a fortune teller who gave up on this couple.`,
    friendzone: `FRIEND ZONE (${percentage}%) — stuck as friends. Sympathetic but funny. Like a tita who feels sorry for them.`,
    mixed: `MIXED SIGNALS (${percentage}%) — confusing and unclear. Confused and relatable. Like a friend giving contradictory advice.`,
    goodmatch: `GOOD MATCH (${percentage}%) — compatible but with a funny catch. Encouraging but realistic. Like a cheerful ninong.`,
    soulmates: `SOULMATES (${percentage}%) — highly compatible but Filipino reality intervenes. Kilig then unexpected reality check.`,
  };

  const categoryPrompt =
    categoryPrompts[categoryId] || categoryPrompts.mixed!;

  const prompt = `Ikaw ay isang Filipino love calculator na may sense of humor.

Ang dalawang pangalan ay: ${name1} at ${name2}
Compatibility: ${categoryContext[categoryId as keyof typeof categoryContext] || categoryContext.mixed}

Category context for tone:
${categoryPrompt}

Gumawa ng tatlong maikling linya para sa kanilang compatibility reading:

LINE 1 — Opening statement tungkol sa kanilang compatibility. 1 sentence.
LINE 2 — Observation tungkol sa kanilang relasyon o sitwasyon. 1 sentence. Dapat nakakatawa.
LINE 3 — Advice o panghuling salita. Nagsisimula sa "Advice:" o "Pro tip:" o "Tandaan:" Dapat may twist.

RULES:
- Isulat sa Tagalog o Taglish
- Family-friendly, walang bastos
- Parang fortune teller na may Filipino humor
- Ang bawat linya ay isang sentence lang
- Huwag gamitin ang mga pangalan sa bawat linya — generic ang dating para ma-reuse
- Ang humor ay dapat relatable sa mga Pilipino
- Huwag maging too dark o cruel

Return ONLY a JSON object:
{
  "line1": "first line here",
  "line2": "second line here",
  "line3": "third line here"
}

No markdown. No explanation. Only the JSON object.`;

  try {
    const result = await generateWithGPT(prompt);
    const cleaned = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const parsed = JSON.parse(cleaned) as {
      line1?: string;
      line2?: string;
      line3?: string;
    };

    if (!parsed.line1 || !parsed.line2 || !parsed.line3) {
      throw new Error("Invalid response structure");
    }

    void supabase.from("community_compatibility").insert({
      category: categoryId,
      line1: parsed.line1,
      line2: parsed.line2,
      line3: parsed.line3,
    });

    return NextResponse.json({
      lines: parsed,
      usingFallback: false,
    });
  } catch {
    try {
      const { data: community } = await supabase
        .from("community_compatibility")
        .select("line1, line2, line3")
        .eq("category", categoryId)
        .limit(20);

      if (community && community.length > 0) {
        const random = community[Math.floor(Math.random() * community.length)]!;
        return NextResponse.json({
          lines: random,
          usingFallback: true,
          source: "community",
        });
      }
    } catch {
      // Community pool also failed, use static fallback
    }

    const fallback = getRandomFallbackLines(categoryId);

    return NextResponse.json({
      lines: fallback,
      usingFallback: true,
      source: "static",
    });
  }
}
