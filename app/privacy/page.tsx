import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "Mikko（ミッコ）のプライバシーポリシーです。",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-black tracking-tight sm:text-4xl">プライバシーポリシー</h1>
      <p className="mt-2 text-sm text-ink-soft">制定日：2026年8月1日</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-ink-soft">
        <section>
          <h2 className="text-lg font-bold text-ink">1. 基本方針</h2>
          <p className="mt-2">
            Mikko（以下「本サービス」）は、利用者の個人情報の保護を重要視し、個人情報の取り扱いを適切に行うために本ポリシーを定めます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">2. 取得する情報</h2>
          <p className="mt-2">本サービスが取得する情報は以下のとおりです。</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>匿名の識別ID（利用回数の管理に使用。個人を特定する情報は含みません）</li>
            <li>利用状況（生成ツールの利用回数等）</li>
            <li>端末・ブラウザの種類、アクセス日時などのアクセスログ</li>
            <li>お問い合わせフォームに入力された内容</li>
            <li>有料プラン決済時の支払い情報（決済はStripeが処理し、本サービスがカード情報を直接保持することはありません）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">3. 利用目的</h2>
          <p className="mt-2">取得した情報は、以下の目的のために利用します。</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>サービス提供および利用回数制限の管理</li>
            <li>サービスの改善・不具合の調査</li>
            <li>お問い合わせへの対応</li>
            <li>セキュリティの確保</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">4. 第三者提供</h2>
          <p className="mt-2">
            本サービスは、以下の場合を除き、個人情報を第三者に提供しません。
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>利用者の同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>決済処理のため、決済代行会社（Stripe）に必要な情報を提供する場合</li>
            <li>アクセス解析のため、外部の解析サービス（Google Analytics等）を利用する場合</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">5. Cookie・広告について</h2>
          <p className="mt-2">
            本サービスは、Google AdSenseなどの広告配信やアクセス解析のため、Cookieを使用することがあります。
          </p>
          <p className="mt-2">
            Google およびそのパートナーは、Cookieを使用して、利用者の過去のアクセス情報に基づいて適切な広告を配信することがあります。利用者は、<a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              Google広告設定
            </a>
            のページで広告パーソナライズを無効化できます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">6. AI生成コンテンツについて</h2>
          <p className="mt-2">
            ContentPilotで生成をリクエストした際、入力されたテーマ・キーワードはAIサービス（Google Gemini）に送信され、コンテンツ生成のために利用されます。入力内容には個人情報を含めないようご注意ください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">7. 外部サービス</h2>
          <p className="mt-2">
            本サービスは以下の外部サービスを利用します。各サービスのプライバシーポリシーもあわせてご確認ください。
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Google Gemini（AIコンテンツ生成）</li>
            <li>Stripe（決済）</li>
            <li>Vercel（ホスティング）</li>
            <li>Google AdSense（広告）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">8. 問い合わせ窓口</h2>
          <p className="mt-2">
            個人情報の取り扱いに関するお問い合わせは、お問い合わせページよりご連絡ください。
          </p>
        </section>
      </div>
    </div>
  );
}
