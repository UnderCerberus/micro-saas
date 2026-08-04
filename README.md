# Mikko

マイクロSaaS「Mikko」— AIコンテンツ生成（ContentPilot）とブランド素材生成（BrandKit）を提供するWebアプリ。

- 本番URL: https://micro-saas-xi.vercel.app
- スタック: Next.js 16（App Router）/ React 19 / TypeScript / Tailwind CSS v4 / Vercel
- 主な外部サービス: Stripe（決済）、Supabase（認証）、Upstash Redis / Vercel KV（利用制限・プラン保存）、Gemini（AI生成）、Resend（メール）、Google AdSense（広告）

## 機能

- **BrandKit** — OG画像・ロゴ・ファビコン・QRコードをブラウザ内で生成（Free: 月2回DL / QRは有料）
- **ContentPilot** — Geminiによるブログ記事・Xスレッド・キャッチコピー生成（Free: 月1回）
- **料金プラン** — Free / Standard ¥500 / Pro ¥900（Stripe Checkoutで即時決済）
- **ログイン** — Supabaseのマジックリンク認証。ログインすると購入プランがデバイスをまたいで共有される
- **匿名購入の引き継ぎ** — 未ログインで購入 → 後からログインするとプランが自動でアカウントへ移行（/api/claim）
- **ブログ** — SEOガイド記事10本（SSG生成・sitemap自動反映）
- **お問い合わせ** — Resendで運営宛メール送信
- **広告** — Google AdSense（審査通過後、自動広告）

## 必要環境

- Node.js 20 以上（Node 22 推奨）
- npm

## ローカルでの起動

```bash
npm install
cp .env.example .env   # 必要に応じて値を設定
npm run dev            # http://localhost:3000
```

ビルド・静的チェック:

```bash
npm run lint
npm run build
```

## 環境変数（.env / Vercel）

`.env.example` を参照。プレフィックスの規約:

- `NEXT_PUBLIC_` 付き → ブラウザに公開される（公開用キーのみ。シークレットを入れない）
- それ以外 → サーバー側のみ（シークレット。ブラウザへ露出しない）

| 変数 | 用途 |
|---|---|
| `GEMINI_API_KEY` | ContentPilotのAI生成（Google AI Studioで無料取得）。未設定時はデモ出力 |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Stripe決済・Webhook署名検証 |
| `STRIPE_PRICE_STANDARD` / `STRIPE_PRICE_PRO` | 各プランのPrice ID（¥500 / ¥900） |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Vercel KV（Upstash）。月次利用制限・プラン保存・レートリミット |
| `RESEND_API_KEY` / `CONTACT_TO` | お問い合わせメール送信 |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Google AdSense クライアントID（ca-pub-...） |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase認証（URLとanon公開キーのみ。service roleは**設定しない**） |

> ⚠️ Supabaseのservice roleキーは本コードでは使用していません。Vercelに設定しないでください（万一漏れるとRLSをバイパスされるため）。

## デプロイ（Vercel）

1. リポジトリをVercelにインポート
2. 上記の環境変数を **Production / Preview 両方** に設定
3. デプロイ

### Stripe Webhook 設定

1. Stripe Dashboard → Developers → Webhooks でエンドポイント作成
2. URL: `https://<あなたのドメイン>/api/webhook`
3. イベント: `checkout.session.completed`（必須）/ `charge.refunded` / `checkout.session.expired`
4. 生成された署名シークレット（`whsec_live_...`）を `STRIPE_WEBHOOK_SECRET` に設定

### Supabase 設定

1. プロジェクト作成後、`supabase/migrations/0001_profiles.sql` を **SQL Editor** で実行
2. Authentication → URL Configuration で Site URL / Redirect URL を設定
3. `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` をVercelに設定

## セキュリティ対策（実装済み）

- シークレットはサーバー側のみで参照、ブラウザには `NEXT_PUBLIC_` 公開キーのみ露出
- Stripe Webhook は `constructEvent` で署名検証（改ざんは拒否）
- Supabase `profiles` テーブルは RLS 有効（本人のみ参照・更新）
- レートリミット（Vercel KV ベース）:
  - `/api/contact`: 同一IP 10分で3通
  - `/api/checkout`: 同一IP 10分で5回
  - `/api/generate`: 同一IP 1分で10回
- セキュリティヘッダー: `X-Content-Type-Options` / `X-Frame-Options: DENY` / `Referrer-Policy` / `Permissions-Policy`

## 主なディレクトリ構成

```
app/
  api/            # APIルート（checkout / webhook / generate / plan / claim / contact）
  blog/           # SEOブログ一覧・詳細（SSG）
  brandkit/       # BrandKitツール
  contentpilot/   # ContentPilotツール
  pricing/        # 料金プラン
components/       # 共通UI（Header / LoginModal / ContactForm / CheckoutButton）
lib/              # ロジック（plan / limits / usage / supabase / useAuth / posts）
public/           # 静的ファイル（favicon・Google確認ファイル等）
proxy.ts          # セッションリフレッシュ用ミドルウェア
```

## ライセンス

Private（個人プロジェクト）
