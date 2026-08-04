import { NextRequest } from "next/server";
import { Resend } from "resend";
import { checkRateLimit } from "@/lib/limits";

export const runtime = "nodejs";
export const maxDuration = 20;

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const CONTACT_TO = process.env.CONTACT_TO || "";

/** IPアドレス（接続元）を推定。Vercelは x-forwarded-for を使う。 */
function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    return fwd.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || req.headers.get("cf-connecting-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  try {
    if (!RESEND_API_KEY || !CONTACT_TO) {
      return Response.json(
        { error: "問い合わせ機能の設定が完了していません。" },
        { status: 503 },
      );
    }

    // スパム/メール送信搾取への対策：同一IPは10分間で3通まで
    const ip = clientIp(req);
    const ratelimited = await checkRateLimit("contact", `ip:${ip}`, 3, 600);
    if (ratelimited) {
      return Response.json(
        { error: "送信が集中しています。しばらくしてからお試しください。" },
        { status: 429 },
      );
    }

    const body = (await req.json()) as {
      name?: string;
      email?: string;
      category?: string;
      text?: string;
    };

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const category = (body.category || "").trim();
    const text = (body.text || "").trim();

    if (!name || !email || !text) {
      return Response.json(
        { error: "お名前・メールアドレス・お問い合わせ内容を入力してください。" },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: "メールアドレスの形式が正しくありません。" },
        { status: 400 },
      );
    }

    const resend = new Resend(RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: `Mikko お問い合わせ <onboarding@resend.dev>`,
      to: [CONTACT_TO],
      replyTo: email,
      subject: `【お問い合わせ】${category || "ご質問・ご相談"}（${name}）`,
      text: `お名前：${name}
メールアドレス：${email}
カテゴリ：${category}

${text}

---
このメールはMikkoのサイトから送信されました。返信時は返信先（${email}）をご利用ください。`,
    });

    if (error) {
      return Response.json(
        { error: "メール送信に失敗しました。時間をおいてお試しください。" },
        { status: 500 },
      );
    }

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json(
      { error: "メール送信に失敗しました。時間をおいてお試しください。", detail: String(e) },
      { status: 500 },
    );
  }
}
