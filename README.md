# MicroKit — マイクロSaaS（Webツールスイート）

完全無料のインフラで運用できるマイクロSaaS。ブランド素材生成（BrandKit）とAIコンテンツ生成（ContentPilot）を1つのアプリに統合しています。

## 含まれるツール

| ツール | 内容 | 費用 |
|---|---|---|
| BrandKit | OG画像・ロゴ・ファビコン・QRコードをブラウザ内で無制限生成 | 0円（AI不使用） |
| ContentPilot | ブログ記事・Xスレッド・キャッチコピーをAI生成 | Gemini Free枠で0円 |
| 料金ページ | Stripe Payment Links によるPro課金 | 売上発生時のみ手数料 |

## 技術スタック（すべて無料枠）

- **ホスティング**: Vercel Hobby（Next.js App Router + Serverless Functions）
- **AI**: Google Gemini API Free 枠（`GEMINI_API_KEY`）
- **決済**: Stripe Payment Links（`NEXT_PUBLIC_STRIPE_PRO_LINK`）
- **広告**: Google AdSense（将来追加、`<AdSense>`スニペットを`app/layout.tsx`に挿入）
- **DB/認証**: Supabase Free（任意・将来拡張用）

## ローカル開発

```bash
npm install
npm run dev
# http://localhost:3000
```

## デプロイ（Vercel・費用0円）

1. このフォルダをGitHubにpush（公開リポジトリでOK）
2. [vercel.com](https://vercel.com) で **New Project** → リポジトリをインポート
3. Environment Variables に設定（`.env.example`参照）:
   - `GEMINI_API_KEY`（[AI Studio](https://aistudio.google.com/)で無料発行）
   - `NEXT_PUBLIC_STRIPE_PRO_LINK`（[Stripe Payment Links](https://dashboard.stripe.com/payment-links)で作成）
4. Deploy。以降、pushするだけで自動デプロイされます。

## マネタイズ設計

1. **Freemium課金**: ContentPilotは月10回まで無料。Pro（Stripe）で無制限化。
2. **広告**: 集客後、Google AdSenseを`layout.tsx`へ導入。
3. **SNS/note集客**: 生成結果をnoteやXで公開する記事で流入を継続。

## 環境変数（`.env.example`参照）

```bash
GEMINI_API_KEY=           # 空ならデモ出力
NEXT_PUBLIC_STRIPE_PRO_LINK=
NEXT_PUBLIC_PRO_PRICE=¥500/月
```

## ディレクトリ構成

```
app/
  page.tsx                 # ランディング
  brandkit/                # 案1：ブランド素材生成（クライアント側で完結）
  contentpilot/            # 案2：AI文章生成
  api/generate/route.ts    # Gemini連携API
  pricing/                 # 料金ページ
lib/brandCanvas.ts         # Canvas生成ロジック（サーバー費用ゼロ）
components/                # Header / Footer
```
