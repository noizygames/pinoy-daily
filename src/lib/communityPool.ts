import { supabase } from "@/lib/supabase";

export const MAX_PER_TABLE = 500;
export const MAX_PICKUP_LINES = 300;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }

  return shuffled;
}

async function trimPredictionsForCategory(categoryId: string): Promise<void> {
  const { count } = await supabase
    .from("community_predictions")
    .select("*", { count: "exact", head: true })
    .eq("category_id", categoryId);

  if (!count || count <= MAX_PER_TABLE) {
    return;
  }

  const excess = count - MAX_PER_TABLE;
  const { data: oldest } = await supabase
    .from("community_predictions")
    .select("id")
    .eq("category_id", categoryId)
    .order("created_at", { ascending: true })
    .limit(excess);

  if (oldest && oldest.length > 0) {
    await supabase
      .from("community_predictions")
      .delete()
      .in(
        "id",
        oldest.map((row) => row.id),
      );
  }
}

async function trimTableToMax(table: "community_excuses" | "community_superpowers"): Promise<void> {
  const { count } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });

  if (!count || count <= MAX_PER_TABLE) {
    return;
  }

  const excess = count - MAX_PER_TABLE;
  const { data: oldest } = await supabase
    .from(table)
    .select("id")
    .order("created_at", { ascending: true })
    .limit(excess);

  if (oldest && oldest.length > 0) {
    await supabase
      .from(table)
      .delete()
      .in(
        "id",
        oldest.map((row) => row.id),
      );
  }
}

async function trimPickupLinesToMax(): Promise<void> {
  const { count } = await supabase
    .from("community_pickup_lines")
    .select("*", { count: "exact", head: true });

  if (!count || count <= MAX_PICKUP_LINES) {
    return;
  }

  const excess = count - MAX_PICKUP_LINES;
  const { data: oldest } = await supabase
    .from("community_pickup_lines")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(excess);

  if (oldest && oldest.length > 0) {
    await supabase
      .from("community_pickup_lines")
      .delete()
      .in(
        "id",
        oldest.map((row) => row.id),
      );
  }
}

export async function savePredictionsToPool(
  categoryId: string,
  predictions: string[],
): Promise<void> {
  try {
    for (const pred of predictions) {
      const { error } = await supabase.from("community_predictions").upsert(
        { category_id: categoryId, prediction: pred },
        { onConflict: "category_id,prediction", ignoreDuplicates: true },
      );

      if (error && process.env.NODE_ENV === "development") {
        console.error("communityPool savePredictionsToPool:", error.message);
      }
    }

    await trimPredictionsForCategory(categoryId);
  } catch {
    // fail silently
  }
}

export async function getPredictionsFromPool(
  categoryId: string,
  count = 5,
): Promise<string[]> {
  try {
    const { data } = await supabase
      .from("community_predictions")
      .select("prediction")
      .eq("category_id", categoryId)
      .order("created_at", { ascending: false })
      .limit(100);

    if (!data || data.length === 0) {
      return [];
    }

    const predictions = data
      .map((row) => row.prediction)
      .filter((prediction): prediction is string => typeof prediction === "string");

    return shuffleArray(predictions).slice(0, count);
  } catch {
    return [];
  }
}

export async function getPoolSize(categoryId: string): Promise<number> {
  try {
    const { count } = await supabase
      .from("community_predictions")
      .select("*", { count: "exact", head: true })
      .eq("category_id", categoryId);

    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function saveExcusesToPool(excuses: string[]): Promise<void> {
  try {
    for (const excuse of excuses) {
      await supabase.from("community_excuses").upsert(
        { excuse },
        { onConflict: "excuse", ignoreDuplicates: true },
      );
    }

    await trimTableToMax("community_excuses");
  } catch {
    // fail silently
  }
}

export async function getExcusesFromPool(count = 5): Promise<string[]> {
  try {
    const { data } = await supabase
      .from("community_excuses")
      .select("excuse")
      .order("created_at", { ascending: false })
      .limit(100);

    if (!data || data.length === 0) {
      return [];
    }

    const excuses = data
      .map((row) => row.excuse)
      .filter((excuse): excuse is string => typeof excuse === "string");

    return shuffleArray(excuses).slice(0, count);
  } catch {
    return [];
  }
}

export async function saveSuperPowersToPool(superpowers: string[]): Promise<void> {
  try {
    for (const superpower of superpowers) {
      await supabase.from("community_superpowers").upsert(
        { superpower },
        { onConflict: "superpower", ignoreDuplicates: true },
      );
    }

    await trimTableToMax("community_superpowers");
  } catch {
    // fail silently
  }
}

export async function getSuperPowersFromPool(count = 5): Promise<string[]> {
  try {
    const { data } = await supabase
      .from("community_superpowers")
      .select("superpower")
      .order("created_at", { ascending: false })
      .limit(100);

    if (!data || data.length === 0) {
      return [];
    }

    const superpowers = data
      .map((row) => row.superpower)
      .filter((superpower): superpower is string => typeof superpower === "string");

    return shuffleArray(superpowers).slice(0, count);
  } catch {
    return [];
  }
}

export async function savePickupLinesToPool(
  lines: string[],
  style: string = "general",
): Promise<void> {
  try {
    for (const line of lines) {
      await supabase.from("community_pickup_lines").upsert(
        { line, style },
        { onConflict: "line", ignoreDuplicates: true },
      );
    }

    await trimPickupLinesToMax();
  } catch {
    // fail silently
  }
}

export async function getPickupLinesFromPool(count = 3): Promise<string[]> {
  try {
    const { data } = await supabase
      .from("community_pickup_lines")
      .select("line")
      .order("created_at", { ascending: false })
      .limit(100);

    if (!data || data.length === 0) {
      return [];
    }

    const lines = data
      .map((row) => row.line)
      .filter((line): line is string => typeof line === "string");

    return shuffleArray(lines).slice(0, count);
  } catch {
    return [];
  }
}
