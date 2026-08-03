import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約",
  description: "Mikko（ミッコ）の利用規約です。",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-black tracking-tight sm:text-4xl">利用規約</h1>
      <p className="mt-2 text-sm text-ink-soft">制定日：2026年8月1日</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-ink-soft">
        <section>
          <h2 className="text-lg font-bold text-ink">1. はじめに</h2>
          <p className="mt-2">
            本規約は、Mikko（以下「本サービス」）の利用条件を定めるものです。本サービスを利用することにより、利用者は本規約に同意したものとみなされます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">2. サービス内容</h2>
          <p className="mt-2">
            本サービスは、ブランド素材（OG画像・ロゴ・ファビコン・QRコード）の生成および、AIによるコンテンツ（ブログ記事・SNS投稿・キャッチコピー）の生成機能を提供します。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">3. 料金とプラン</h2>
          <p className="mt-2">
            本サービスは無料プラン（Free）と有料プラン（Standard・Pro）を提供します。各プランの内容・料金・利用回数は、料金ページに表示する内容に準じます。有料プランの決済はStripeを通じて行われます。
          </p>
          <p className="mt-2">
            無料プランの月間利用回数は毎月自動的にリセットされます。利用回数の詳細は各ツール画面に表示されます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">4. 生成物の権利</h2>
          <p className="mt-2">
            利用者が本サービスで生成した画像・文章等（以下「生成物」）は、原則として利用者に帰属します。生成物は商用利用・再配布が可能です。ただし、生成物の利用により生じた損害について、本サービスは責任を負いません。
          </p>
          <p className="mt-2">
            AIにより生成された内容は自動的に作成されるものであり、正確性・安全性・著作権上の適法性を保証するものではありません。利用者は、生成物を利用する前に事実確認と法令・権利の確認を行う責任を負います。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">5. 禁止事項</h2>
          <p className="mt-2">利用者は、以下の行為を行ってはなりません。</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>法令または公序良俗に違反する行為</li>
            <li>他人の権利（知的財産権・プライバシー等）を侵害する行為</li>
            <li>本サービスの運営を妨害する行為、システムへの不正アクセス</li>
            <li>利用回数制限の回避を目的とした不正行為（アカウントの不正利用等）</li>
            <li>その他、本サービスの運営者が不適切と判断する行為</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">6. サービスの変更・中断</h2>
          <p className="mt-2">
            本サービスは、予告なく内容の変更・追加・削除、または提供の中断・停止を行うことがあります。これにより利用者に生じた損害について、本サービスは責任を負いません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">7. 免責事項</h2>
          <p className="mt-2">
            本サービスは「現状有姿」で提供されます。本サービスの利用により生じた一切の損害について、本サービスの運営者は責任を負いません。生成物の利用に関する責任は、全て利用者に帰属します。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">8. 規約の変更</h2>
          <p className="mt-2">
            本規約は、予告なく変更されることがあります。変更後の規約は、本ページに掲載した時点で効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">9. 準拠法と管轄</h2>
          <p className="mt-2">
            本規約は日本法に準拠します。本サービスに関する紛争は、本サービスの運営者の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">10. お問い合わせ</h2>
          <p className="mt-2">
            本規約に関するお問い合わせは、お問い合わせページよりお願いします。
          </p>
        </section>
      </div>
    </div>
  );
}
