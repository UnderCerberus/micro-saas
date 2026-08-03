import type { Metadata } from "next";
import ContentPilotClient from "./ContentPilotClient";

export const metadata: Metadata = {
  title: "ContentPilot｜AIでブログ記事・Xスレッド・キャッチコピーを自動生成",
  description:
    "テーマを入力するだけで、SEOに強いブログ記事・X（Twitter）スレッド・キャッチコピーをAIが日本語最適化で自動生成。無料でお試しできます。",
};

export default function ContentPilotPage() {
  return <ContentPilotClient />;
}