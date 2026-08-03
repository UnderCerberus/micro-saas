import { NextRequest } from "next/server";
import Stripe from "stripe";
import { setPlan } from "@/lib/plan";
import { sanitizeAnonId } from "@/lib/limits";

export const runtime = "nodejs";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

async function setPlanFromMetadata(
  metadata: Stripe.Metadata | null | undefined,
  plan: "standard" | "pro",
) {
  const anonId = sanitizeAnonId((metadata?.anonId as string | undefined) || null);
  if (anonId) {
    await setPlan(anonId, plan);
  }
}

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  // 未設定（テスト中・シークレット未登録）時は素通しにせず、403を返す。
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return new Response("Webhook not configured", { status: 503 });
  }

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(payload, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed";
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const plan = session.metadata?.plan === "pro" ? "pro" : "standard";
      await setPlanFromMetadata(session.metadata, plan);
      break;
    }
    case "checkout.session.expired": {
      // 支払いが完了しなかった場合は何もしない（プランは付与されていない）
      break;
    }
    case "charge.refunded":
    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const anonId = sanitizeAnonId((session?.metadata?.anonId as string | undefined) || null);
      if (anonId) await setPlan(anonId, "free");
      break;
    }
    default:
      break;
  }

  return Response.json({ received: true });
}