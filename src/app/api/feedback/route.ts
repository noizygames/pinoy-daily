import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function getManilaDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
  }).format(date);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      user_id?: string;
      rating?: number;
      favorite_feature?: string;
      opinion?: string;
      comment?: string;
      email?: string;
      page_from?: string;
      client_date?: string;
    };

    if (!body.user_id || !body.rating || !body.favorite_feature || !body.opinion) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    const todayKey = body.client_date || getManilaDateKey();
    const { data: recentRows } = await supabase
      .from("feedback")
      .select("id, created_at")
      .eq("user_id", body.user_id)
      .order("created_at", { ascending: false })
      .limit(5);

    const alreadySubmittedToday = (recentRows ?? []).some(
      (row) => getManilaDateKey(new Date(row.created_at)) === todayKey,
    );

    if (alreadySubmittedToday) {
      return NextResponse.json(
        {
          error: "already_submitted",
          message: "Nagpadala ka na ng feedback ngayon. Bumalik bukas!",
        },
        { status: 429 },
      );
    }

    const { error } = await supabase.from("feedback").insert({
      user_id: body.user_id,
      rating: body.rating,
      favorite_feature: body.favorite_feature,
      opinion: body.opinion,
      comment: body.comment || null,
      email: body.email || null,
      page_from: body.page_from || "feedback-page",
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 },
    );
  }
}
