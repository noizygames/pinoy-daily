import { NextResponse } from "next/server";
import { getManilaDateString } from "@/data/ulamList";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = getManilaDateString();

  try {
    const { data: existing, error: selectError } = await supabase
      .from("daily_ulam")
      .select("id, dish_name")
      .eq("date", today);

    if (selectError) throw selectError;

    const { error: deleteError } = await supabase
      .from("daily_ulam")
      .delete()
      .eq("date", today);

    if (deleteError) throw deleteError;

    const { data: remaining, error: verifyError } = await supabase
      .from("daily_ulam")
      .select("id")
      .eq("date", today);

    if (verifyError) throw verifyError;

    if (remaining && remaining.length > 0) {
      return NextResponse.json(
        {
          error:
            "Delete blocked — add daily_ulam_delete RLS policy in Supabase SQL Editor.",
          rows_remaining: remaining.length,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Cleared ulam cache for ${today}. Next visit will generate a new ulam.`,
      cleared_rows: existing?.length ?? 0,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
