import { NextResponse } from "next/server";
import { generateWithGPT } from "@/lib/openai";
import { getManilaDateString, getTodaysUlamName } from "@/data/ulamList";
import { isCompleteUlam, normalizeUlam } from "@/lib/ulamNormalize";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

function jsonResponse(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      ...NO_CACHE_HEADERS,
      ...init?.headers,
    },
  });
}

type UlamRecipe = {
  dish_name: string;
  description: string;
  servings: number;
  cooking_time_minutes: number;
  difficulty: string;
  calories_per_serving: number;
  ingredients: Array<{ name: string; amount: string; unit: string }>;
  steps: string[];
};

function getFallbackUlam(dishName: string): UlamRecipe {
  const fallbacks: Record<string, UlamRecipe> = {
    "Adobong Manok": {
      dish_name: "Adobong Manok",
      description:
        "Ang adobo ay isa sa pinakasikat na putahe ng Pilipinas na ginagamit ang suka at toyo para sa malalim na lasa.",
      servings: 4,
      cooking_time_minutes: 45,
      difficulty: "Easy",
      calories_per_serving: 380,
      ingredients: [
        { name: "Manok", amount: "1", unit: "kg" },
        { name: "Toyo", amount: "1/2", unit: "cup" },
        { name: "Suka", amount: "1/4", unit: "cup" },
        { name: "Bawang", amount: "6", unit: "pcs" },
        { name: "Bay leaves", amount: "3", unit: "pcs" },
        { name: "Paminta", amount: "1", unit: "tsp" },
        { name: "Asukal", amount: "1", unit: "tsp" },
        { name: "Mantika", amount: "2", unit: "tbsp" },
      ],
      steps: [
        "Hugasan ang manok at hiwain sa serving pieces.",
        "Ibabad ang manok sa toyo, suka, bawang, at paminta ng 30 minuto.",
        "Igisa ang bawang sa mantika hanggang ginto ang kulay.",
        "Ilagay ang marinated na manok kasama ang marinade sa kawali.",
        "Takpan at lutuin sa mahinang apoy ng 20 minuto.",
        "Alisin ang takip at lutuin pa hanggang lumapot ang sarsa.",
        "Tikman at ayusin ang seasoning. Ihain na may mainit na kanin.",
      ],
    },
    "Sinigang na Baboy": {
      dish_name: "Sinigang na Baboy",
      description:
        "Ang sinigang ay isang maasim na sabaw na putahe na paboritong-paborito ng mga Pilipino. Ginagamit ang sampalok para sa asim.",
      servings: 4,
      cooking_time_minutes: 60,
      difficulty: "Easy",
      calories_per_serving: 320,
      ingredients: [
        { name: "Baboy ribs", amount: "500", unit: "g" },
        { name: "Sampalok mix", amount: "1", unit: "pack" },
        { name: "Kangkong", amount: "1", unit: "bundle" },
        { name: "Sitaw", amount: "100", unit: "g" },
        { name: "Talong", amount: "2", unit: "pcs" },
        { name: "Sibuyas", amount: "1", unit: "pc" },
        { name: "Kamatis", amount: "2", unit: "pcs" },
        { name: "Patis", amount: "2", unit: "tbsp" },
        { name: "Tubig", amount: "6", unit: "cups" },
      ],
      steps: [
        "Pakuluan ang baboy sa tubig ng 10 minuto at itapon ang unang sabaw.",
        "Lagyan ng bagong tubig at pakuluan muli kasama ang sibuyas at kamatis.",
        "Lutuin ang baboy ng 30 minuto hanggang lumambot.",
        "Dagdagan ng sampalok mix at haluin.",
        "Ilagay ang sitaw at talong at lutuin ng 5 minuto.",
        "Ilagay ang kangkong at lutuin ng 2 minuto pa.",
        "Timplahan ng patis at asin. Ihain ng mainit.",
      ],
    },
  };

  if (fallbacks[dishName]) {
    return fallbacks[dishName]!;
  }

  return {
    dish_name: dishName,
    description: `Ang ${dishName} ay isang tradisyonal na putaheng Pinoy na paborito sa maraming pamilya.`,
    servings: 4,
    cooking_time_minutes: 45,
    difficulty: "Medium",
    calories_per_serving: 350,
    ingredients: [
      { name: "Main ingredient", amount: "500", unit: "g" },
      { name: "Bawang", amount: "4", unit: "pcs" },
      { name: "Sibuyas", amount: "1", unit: "pc" },
      { name: "Asin", amount: "1", unit: "tsp" },
      { name: "Paminta", amount: "1/2", unit: "tsp" },
      { name: "Mantika", amount: "2", unit: "tbsp" },
    ],
    steps: [
      `Ihanda ang mga sangkap para sa ${dishName}.`,
      "Igisa ang bawang at sibuyas sa mantika.",
      "Ilagay ang main ingredient at lutuin hanggang maluto.",
      "Timplahan ng asin at paminta.",
      "Ihain ng mainit kasama ang kanin.",
    ],
  };
}

async function getCachedUlam(today: string) {
  const { data: cached, error: cacheError } = await supabase
    .from("daily_ulam")
    .select("*")
    .eq("date", today)
    .maybeSingle();

  if (cacheError) {
    throw cacheError;
  }

  return cached;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cacheOnly = searchParams.get("cacheOnly") === "true";
  const today = getManilaDateString();
  const dishName = getTodaysUlamName();

  try {
    const cached = await getCachedUlam(today);

    if (cached) {
      if (cached.dish_name !== dishName || !isCompleteUlam(cached)) {
        await supabase.from("daily_ulam").delete().eq("date", today);
      } else {
        return jsonResponse({
          ulam: normalizeUlam(cached),
          cached: true,
          dish_name: cached.dish_name,
        });
      }
    }

    if (cacheOnly) {
      return jsonResponse({
        ulam: null,
        cached: false,
        dish_name: dishName,
      });
    }
  } catch (err) {
    console.error("Cache check failed:", err);
    if (cacheOnly) {
      return jsonResponse({
        ulam: null,
        cached: false,
        dish_name: dishName,
      });
    }
  }

  const prompt = `You are an expert Filipino chef and nutritionist. Generate a complete and accurate recipe for ${dishName}.

Return a JSON object with EXACTLY this structure. No markdown, no extra fields, no explanation:
{
  "dish_name": "${dishName}",
  "description": "2 sentence description of the dish and its cultural significance in Filipino cuisine",
  "servings": 4,
  "cooking_time_minutes": [accurate realistic number],
  "difficulty": "Easy" or "Medium" or "Hard",
  "calories_per_serving": [accurate number calculated from ingredients],
  "ingredients": [
    { "name": "ingredient name in Filipino or English", "amount": "quantity", "unit": "g or kg or ml or cups or pcs or tbsp or tsp" }
  ],
  "steps": [
    "Step 1: Complete instruction",
    "Step 2: Complete instruction"
  ]
}

STRICT REQUIREMENTS:
- ingredients must be the authentic traditional ingredients for ${dishName}
- amounts must be realistic for exactly 4 servings
- calories_per_serving must be calculated based on the actual ingredients listed
- steps must be in correct cooking order with 5 to 10 steps
- cooking_time_minutes must be realistic
- Return ONLY the JSON object with no markdown code blocks`;

  let generatedUlam: UlamRecipe;

  try {
    const result = await generateWithGPT(prompt);

    const cleaned = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned) as UlamRecipe;

    if (
      !parsed.dish_name ||
      !parsed.ingredients ||
      !parsed.steps ||
      !Array.isArray(parsed.ingredients) ||
      !Array.isArray(parsed.steps)
    ) {
      throw new Error("Invalid response structure from GPT");
    }

    generatedUlam = parsed;
  } catch (parseError) {
    console.error("GPT generation or parsing failed:", parseError);
    generatedUlam = getFallbackUlam(dishName);
  }

  try {
    const { data: saved, error: saveError } = await supabase
      .from("daily_ulam")
      .upsert(
        {
          date: today,
          dish_name: generatedUlam.dish_name,
          description: generatedUlam.description,
          ingredients: generatedUlam.ingredients,
          steps: generatedUlam.steps,
          calories_per_serving: generatedUlam.calories_per_serving,
          servings: generatedUlam.servings || 4,
          cooking_time_minutes: generatedUlam.cooking_time_minutes,
          difficulty: generatedUlam.difficulty || "Medium",
        },
        { onConflict: "date" },
      )
      .select()
      .single();

    if (saveError) {
      if (saveError.code === "23505") {
        const existing = await getCachedUlam(today);
        if (existing) {
          return jsonResponse({
            ulam: normalizeUlam(existing),
            cached: true,
            dish_name: existing.dish_name,
          });
        }
      }

      console.error("Failed to save to Supabase:", saveError);
      return jsonResponse({
        ulam: normalizeUlam(generatedUlam),
        cached: false,
        saved: false,
      });
    }

    return jsonResponse({
      ulam: normalizeUlam(saved),
      cached: false,
      saved: true,
    });
  } catch (saveErr) {
    console.error("Supabase save error:", saveErr);
    return jsonResponse({
      ulam: normalizeUlam(generatedUlam),
      cached: false,
      saved: false,
    });
  }
}
