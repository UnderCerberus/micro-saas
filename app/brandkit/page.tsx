import type { Metadata } from "next";
import BrandKitClient from "./BrandKitClient";

export const metadata: Metadata = {
  title: "BrandKit｜OG画像・ロゴ・ファビコン・QRコードを無料で一括生成",
  description:
    "ブランド素材を数秒で生成。OG画像（1200×630）・ロゴ・ファビコン・QRコードをブラウザ内で無料・無制限に作成できます。",
};

export default function BrandKitPage() {
  return <BrandKitClient />;
}