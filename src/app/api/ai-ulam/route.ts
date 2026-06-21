import { NextResponse } from "next/server";
import { generateWithGPT } from "@/lib/openai";
import { supabase } from "@/lib/supabase";

const ulamList = [
  "Adobong Manok",
  "Sinigang na Baboy",
  "Kare-Kare",
  "Paksiw na Isda",
  "Bistek Tagalog",
  "Tinolang Manok",
  "Ginisang Monggo",
  "Pinakbet",
  "Lechon Kawali",
  "Mechado",
  "Afritada",
  "Caldereta",
  "Nilaga",
  "Menudo",
  "Pork Sisig",
  "Bangus Sisig",
  "Tortang Talong",
  "Ginisang Ampalaya",
  "Dinuguan",
  "Pochero",
  "Laing",
  "Bicol Express",
  "Humba",
  "Igado",
  "Pinapaitan",
  "Bulalo",
  "Crispy Pata",
  "Binagoongan",
  "Pork Barbecue",
  "Inihaw na Liempo",
];

const fallbackUlam = (today: string) => ({
  date: today,
  dish_name: "Adobong Manok",
  description:
    "Ang adobo ay isa sa pinakasikat na putahe ng Pilipinas. Ginagamit ang suka at toyo para sa malalim na lasa.",
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
    "Igisa ang bawang sa mantika hanggang ginto.",
    "Ilagay ang marinated na manok kasama ang marinade.",
    "Takpan at lutuin sa mahinang apoy ng 20 minuto.",
    "Alisin ang takip at lutuin hanggang lumapot ang sarsa.",
    "Tikman at ayusin ang seasoning. Ihain na may kanin.",
  ],
});

function buildUlamPrompt(todaysUlam: string): string {
  return `You are an expert Filipino chef and nutritionist. Generate a complete and accurate recipe for ${todaysUlam}.

Return a JSON object with EXACTLY this structure — no extra fields, no markdown:
{
  "dish_name": "${todaysUlam}",
  "description": "2 sentence description of the dish and its origin or cultural significance",
  "servings": 4,
  "cooking_time_minutes": [accurate number],
  "difficulty": "Easy" or "Medium" or "Hard",
  "calories_per_serving": [accurate number based on ingredients],
  "ingredients": [
    { "name": "ingredient name", "amount": "quantity", "unit": "g/kg/ml/cups/pcs/tbsp/tsp" }
  ],
  "steps": [
    "Step 1: Complete detailed instruction",
    "Step 2: Complete detailed instruction"
  ]
}

ACCURACY REQUIREMENTS:
- Ingredients must be the authentic traditional ingredients for ${todaysUlam}
- Amounts must be realistic for 4 servings
- Calorie count must be calculated based on the actual ingredients listed
- Cooking steps must be in the correct order and complete
- Cooking time must be realistic
- Use common Filipino measurements where appropriate (cups, tablespoons)
- Include prep steps like washing, cutting, marinating where needed

IMPORTANT:
- Return ONLY the JSON object
- No markdown code blocks
- No explanation text
- All fields are required
- Steps array should have 5 to 10 steps
- Ingredients array should have 6 to 15 ingredients`;
}

async function getCachedUlam(today: string) {
  const { data } = await supabase
    .from("daily_ulam")
    .select("*")
    .eq("date", today)
    .maybeSingle();

  return data;
}

type UlamInsert = {
  dish_name: string;
  description: string;
  ingredients: unknown;
  steps: unknown;
  calories_per_serving: number;
  servings: number;
  cooking_time_minutes: number;
  difficulty: string;
};

async function saveDailyUlam(today: string, ulamData: UlamInsert) {
  const { data, error } = await supabase
    .from("daily_ulam")
    .insert({
      date: today,
      dish_name: ulamData.dish_name,
      description: ulamData.description,
      ingredients: ulamData.ingredients,
      steps: ulamData.steps,
      calories_per_serving: ulamData.calories_per_serving,
      servings: ulamData.servings,
      cooking_time_minutes: ulamData.cooking_time_minutes,
      difficulty: ulamData.difficulty,
    })
    .select()
    .single();

  if (error) {
    const cached = await getCachedUlam(today);
    if (cached) return cached;
    throw error;
  }

  return data;
}

export async function GET() {
  const today = new Date().toISOString().split("T")[0]!;

  const existing = await getCachedUlam(today);
  if (existing) {
    return NextResponse.json({ ulam: existing, cached: true });
  }

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const todaysUlam = ulamList[dayOfYear % ulamList.length]!;
  const prompt = buildUlamPrompt(todaysUlam);

  try {
    const result = await generateWithGPT(prompt);

    const cleanResult = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const ulamData = JSON.parse(cleanResult) as {
      dish_name: string;
      description: string;
      ingredients: unknown;
      steps: unknown;
      calories_per_serving: number;
      servings: number;
      cooking_time_minutes: number;
      difficulty: string;
    };

    const saved = await saveDailyUlam(today, ulamData);
    return NextResponse.json({ ulam: saved, cached: false });
  } catch {
    try {
      const saved = await saveDailyUlam(today, fallbackUlam(today));
      return NextResponse.json({
        ulam: saved,
        cached: false,
        usingFallback: true,
      });
    } catch {
      const cached = await getCachedUlam(today);
      return NextResponse.json({
        ulam: cached ?? fallbackUlam(today),
        cached: Boolean(cached),
        usingFallback: true,
      });
    }
  }
}
