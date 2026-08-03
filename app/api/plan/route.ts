import { NextRequest } from "next/server";
import { getPlan, type Plan } from "@/lib/plan";
import { sanitizeAnonId } from "@/lib/limits";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const anonId = sanitizeAnonId(req.headers.get("x-anon-id"));
  const plan: Plan = await getPlan(anonId);
  return Response.json({ plan });
}