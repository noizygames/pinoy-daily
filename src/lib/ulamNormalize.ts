import type { UlamIngredient } from "@/lib/supabase";

export type UlamRecipe = {
  dish_name: string;
  description: string;
  servings: number;
  cooking_time_minutes: number;
  difficulty: string;
  calories_per_serving: number;
  ingredients: UlamIngredient[];
  steps: string[];
};

type RawUlam = Partial<UlamRecipe> & {
  ingredients?: unknown;
  steps?: unknown;
};

function parseJsonValue(value: unknown): unknown {
  let current = value;

  for (let i = 0; i < 3; i++) {
    if (typeof current !== "string") break;

    try {
      current = JSON.parse(current) as unknown;
    } catch {
      break;
    }
  }

  return current;
}

function normalizeIngredients(raw: unknown): UlamIngredient[] {
  const parsed = parseJsonValue(raw);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .map((item) => {
      if (typeof item === "string") {
        return { name: item, amount: "", unit: "" };
      }

      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;

      return {
        name: String(record.name ?? record.ingredient ?? "").trim(),
        amount: String(record.amount ?? record.qty ?? record.quantity ?? "").trim(),
        unit: String(record.unit ?? "").trim(),
      };
    })
    .filter((item): item is UlamIngredient => Boolean(item?.name));
}

function normalizeSteps(raw: unknown): string[] {
  const parsed = parseJsonValue(raw);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .map((step) => {
      if (typeof step === "string") return step.trim();
      if (step && typeof step === "object" && "text" in step) {
        return String((step as { text: unknown }).text).trim();
      }
      return "";
    })
    .filter(Boolean);
}

export function normalizeUlam(raw: RawUlam | null | undefined): UlamRecipe | null {
  if (!raw?.dish_name) return null;

  const ingredients = normalizeIngredients(raw.ingredients);
  const steps = normalizeSteps(raw.steps);

  return {
    dish_name: raw.dish_name,
    description: raw.description ?? "",
    servings: Number(raw.servings) || 4,
    cooking_time_minutes: Number(raw.cooking_time_minutes) || 45,
    difficulty: raw.difficulty ?? "Medium",
    calories_per_serving: Number(raw.calories_per_serving) || 0,
    ingredients,
    steps,
  };
}

export function isCompleteUlam(raw: RawUlam | null | undefined): boolean {
  const normalized = normalizeUlam(raw);
  return Boolean(
    normalized &&
      normalized.ingredients.length > 0 &&
      normalized.steps.length > 0,
  );
}
