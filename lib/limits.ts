import { Redis } from "@upstash/redis";
import { monthKey } from "@/lib/usage";

let _redis: Redis | null = null;

/** KV (Upstash Redis) を取得。未設定時は null。 */
export function kv(): Redis | null {
  if (!kvEnabled()) return null;
  if (!_redis) {
    _redis = new Redis({
      url: process.env.KV_REST_API_URL || "",
      token: process.env.KV_REST_API_TOKEN || "",
    });
  }
  return _redis;
}

export function kvEnabled(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

/** KVのキー。例: "usage:2026-08:{anonId}" */
export function usageKey(namespace: string, anonId: string, now: Date = new Date()): string {
  return `usage:${monthKey(now)}:${namespace}:${anonId}`;
}

/**
 * 当月の利用回数を返す（KV未設定時は null）。
 * サーバー側で月が変われば自動で0に戻る（キーに月を含むため）。
 */
export async function getUsage(namespace: string, anonId: string): Promise<number | null> {
  const client = kv();
  if (!client) return null;
  const raw = await client.get<number>(usageKey(namespace, anonId));
  return typeof raw === "number" ? raw : 0;
}

/** 利用回数を1増やし、増加後の値を返す（KV未設定時は null）。 */
export async function incrementUsage(
  namespace: string,
  anonId: string,
): Promise<number | null> {
  const client = kv();
  if (!client) return null;
  return client.incr(usageKey(namespace, anonId));
}

/** 匿名IDが無効な場合は空文字を返す。 */
export function sanitizeAnonId(value: string | null): string {
  if (!value) return "";
  const trimmed = value.trim();
  return /^[A-Za-z0-9-]{8,64}$/.test(trimmed) ? trimmed : "";
}

/**
 * 単純な固定ウィンドウのレートリミット。
 * 指定ウィンドウ秒数内で limit 回を超えたら true（超過）を返す。
 * KV未設定時は拒否しない（安全側ではないが、本番KVがなければ機能を止めない）。
 */
export async function checkRateLimit(
  bucket: string,
  id: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const client = kv();
  if (!client || !id) return false;
  const key = `rl:${bucket}:${Math.floor(Date.now() / (windowSeconds * 1000))}:${id}`;
  const current = await client.incr(key);
  if (current === 1) {
    await client.expire(key, windowSeconds);
  }
  return current > limit;
}
