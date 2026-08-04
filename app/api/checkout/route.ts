import { NextRequest } from "next/server";
import Stripe from "stripe";
import { sanitizeAnonId } from "@/lib/limits";
import { getAuthedUserId } from "@/lib/supabase-server";

export const runtime = "nodejs";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_PRICE_STANDARD = process.env.STRIPE_PRICE_STANDARD || "";
const STRIPE_PRICE_PRO = process.env.STRIPE_PRICE_PRO || "";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { plan?: string; anonId?: string };
    const plan = body.plan === "pro" ? "pro" : "standard";
    const authed = await getAuthedUserId(req);
    const anonId = authed || sanitizeAnonId(body.anonId || null);
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    if (!STRIPE_SECRET_KEY) {
      return Response.json({ error: "決済機能の設定が完了していません。" }, { status: 503 });
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const priceId = plan === "pro" ? STRIPE_PRICE_PRO : STRIPE_PRICE_STANDARD;
    if (!priceId) {
      return Response.json({ error: "プランの価格設定がありません。" }, { status: 503 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { plan, anonId },
      success_url: `${origin}/pricing?status=success&plan=${plan}`,
      cancel_url: `${origin}/pricing?status=cancel`,
    });

    return Response.json({ url: session.url });
  } catch (e) {
    return Response.json(
      { error: "決済セッションの作成に失敗しました", detail: String(e) },
      { status: 500 },
    );
  }
}
