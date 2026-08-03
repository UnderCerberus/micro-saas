import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "Mikko（ミッコ）へのお問い合わせページです。",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <div className="text-center">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">お問い合わせ</h1>
        <p className="mt-3 text-ink-soft">
          サービスについてのご質問・不具合の報告・ご要望など、お気軽にお知らせください。
        </p>
      </div>

      <ContactForm />
    </div>
  );
}