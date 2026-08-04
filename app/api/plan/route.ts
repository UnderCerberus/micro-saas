import { NextRequest } from "next/server";
import { getPlan, type Plan } from "@/lib/plan";
import { sanitizeAnonId } from "@/lib/limits";
import { getAuthedUserId } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const authed = await getAuthedUserId(req);
  const anonId = authed || sanitizeAnonId(req.headers.get("x-anon-id"));
  const plan: Plan = await getPlan(anonId);
  return Response.json({ plan });
}
