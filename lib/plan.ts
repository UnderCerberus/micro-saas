import { kv } from "@/lib/limits";

export type Plan = "free" | "standard" | "pro";

/** KVのキー。例: "plan:{anonId}" */
function planKey(anonId: string): string {
  return `plan:${anonId}`;
}

/** 匿名IDのプラン状態を取得（KV未設定時は free）。 */
export async function getPlan(anonId: string): Promise<Plan> {
  const client = kv();
  if (!client || !anonId) return "free";
  const raw = await client.get<string>(planKey(anonId));
  if (raw === "standard" || raw === "pro") return raw;
  return "free";
}

/** プラン状態を保存する（未設定時は no-op）。 */
export async function setPlan(anonId: string, plan: Plan): Promise<void> {
  const client = kv();
  if (!client || !anonId) return;
  if (plan === "free") {
    await client.del(planKey(anonId));
  } else {
    await client.set(planKey(anonId), plan);
  }
}

/** 有料プランかどうか（ContentPilot/BrandKitの制限解除判定に使う）。 */
export function isPaid(plan: Plan): boolean {
  return plan === "standard" || plan === "pro";
}
