import { NextRequest } from "next/server";
import { getPlan, setPlan } from "@/lib/plan";
import { sanitizeAnonId } from "@/lib/limits";
import { getAuthedUserId } from "@/lib/supabase-server";

export const runtime = "nodejs";

/**
 * ログイン時に、匿名（未ログイン）で購入したプランを
 * 現在のログインユーザーIDへ引き継ぐ。
 * body: { anonId: string }
 */
export async function POST(req: NextRequest) {
  const userId = await getAuthedUserId(req);
  if (!userId) {
    return Response.json({ error: "認証が必要です" }, { status: 401 });
  }

  let anonId = "";
  try {
    const body = await req.json();
    anonId = String(body?.anonId || "").trim();
  } catch {
    /* noop */
  }
  anonId = sanitizeAnonId(anonId);
  if (!anonId) {
    return Response.json({ error: "anonId がありません" }, { status: 400 });
  }

  // 匿名側のプランが有料ならログインユーザーIDへ移行する
  const plan = await getPlan(anonId);
  if (plan !== "free") {
    await setPlan(userId, plan);
    await setPlan(anonId, "free");
  }

  return Response.json({ claimed: plan !== "free", plan });
}
