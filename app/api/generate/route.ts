import { NextRequest } from "next/server";
import { getUsage, incrementUsage, sanitizeAnonId } from "@/lib/limits";

export const runtime = "nodejs";
export const maxDuration = 30;

/** ContentPilotのFree枠（月1回） */
const CP_FREE_LIMIT = 1;

type Mode = "blog" | "thread" | "catchcopy";

interface GenRequest {
  mode: Mode;
  topic: string;
  keywords?: string;
  style?: string;
  length?: number;
}

const GENERATE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}";
const API_KEY = process.env.GEMINI_API_KEY || "";
const MODEL = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";

function buildPrompt(r: GenRequest): string {
  const style = r.style || "丁寧で読みやすい";
  const scope = `テーマ：${r.topic || "（未指定）"}
追加キーワード・要件：${r.keywords || "（なし）"}
文体・トーン：${style}`;

  if (r.mode === "blog") {
    return `あなたは日本語SEOに強いベテランWebライターです。以下の情報をもとに、検索流入を狙えるブログ記事を生成してください。
要件：
- 構造化された見出し（H1は要約タイトル、本文はH2/H3）を必ず使う
- 導入→課題→解決策→まとめ の流れで書く
- キーワードを自然に散りばめる
- 具体例や実践ステップを交える
- 想定文字数：約${r.length ?? 800}字
${scope}
見出しを含む全文（Markdown形式）を出力してください。説明・前置きは不要。本文のみ出力。`;
  }

  if (r.mode === "thread") {
    return `あなたはX（Twitter）で伸びるスレッドを作るマーケターです。
テーマについて、連番付きのスレッド形式で${r.length || 10}ツイートを出力してください。
要件：
- 1番目は人を止めるフック
- 各ツイートは1〜3文で簡潔に、改行をうまく使う
- 最後にまとめと行動喚起
- 適切なハッシュタグを末尾に
${scope}
番号付き（1. 2. ...）で、各ツイートの間に空行を挟んで出力してください。説明書きは不要。`;
  }

  return `あなたは広告コピーライターです。
以下の商品・テーマに対するキャッチコピーを${r.length || 10}個、バリエーション豊かに提案してください。
要件：
- 各コピーは日本語で簡潔（1行以内）
- 感情に響くもの・具体的な効果が伝わるもの・短いもの を混ぜる
- 文末に一言の補足（想定ターゲット）を付ける
${scope}
番号付きリストで出力してください。余計な説明は不要。`;
}

const DEMO_TEXT = `# 【サンプル出力】AI自動生成ツールでブログ運営を効率化する方法

## はじめに
ブログ運営で最も時間がかかるのは「記事作成」です。今回はAIを活用して、品質を落とさずに記事を量産する具体的な手順を解説します。

## なぜAI記事作成が注目されるのか
- 月10本以上の更新が可能になり、SEO評価が上がりやすい
- 定型的な文章を人間が書く手間を省ける
- アイデア出しにも活用できる

## AI活用の3ステップ
1. テーマとキーワードを決める
2. 見出し構成をAIに作らせる
3. 本文を生成して人間が修正する

## 注意点
AI出力はそのまま使わず、必ず事実確認と加筆・修正を行いましょう。これだけで品質と被評価が大きく向上します。

"GEMINI_API_KEY が未設定のため、デモ用のサンプル結果を表示しています。環境変数を設定すると本番のAI出力が得られます。"`;

export async function POST(req: NextRequest) {
  try {
    const anonId = sanitizeAnonId(req.headers.get("x-anon-id"));
    const current = anonId ? await getUsage("contentpilot", anonId) : null;

    if (current !== null && current >= CP_FREE_LIMIT) {
      return Response.json(
        { demo: false, error: "limit", message: "無料回数の上限に達しました。アップグレードをご検討ください。" },
        { status: 429 },
      );
    }

    const body = (await req.json()) as Partial<GenRequest>;
    const mode: Mode = body.mode === "thread" || body.mode === "catchcopy" ? body.mode : "blog";

    if (!API_KEY) {
      if (anonId) await incrementUsage("contentpilot", anonId);
      return Response.json({ text: DEMO_TEXT, demo: true });
    }

    const prompt = buildPrompt({
      mode,
      topic: (body.topic || "").toString(),
      keywords: (body.keywords || "").toString(),
      style: (body.style || "").toString(),
      length: Number(body.length) || 800,
    });

    const res = await fetch(GENERATE_URL.replace("{model}", MODEL).replace("{key}", API_KEY), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json(
        { demo: false, error: `Gemini APIエラー（${res.status}）`, detail: errText },
        { status: 500 },
      );
    }

    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text || "")
        .join("") || "";

    if (!text) {
      return Response.json({ demo: false, error: "AIの応答が空でした" }, { status: 500 });
    }
    if (anonId) await incrementUsage("contentpilot", anonId);
    return Response.json({ text, demo: false });
  } catch (e) {
    return Response.json(
      { demo: false, error: "処理中にエラーが発生しました", detail: String(e) },
      { status: 500 },
    );
  }
}