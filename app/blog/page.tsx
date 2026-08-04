import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "ブログ｜Mikko公式ガイド",
  description:
    "OG画像・ロゴ・QRコードの作り方、AIを使ったブログ記事の書き方、マイクロSaaSの始め方まで。Mikkoの公式ブログでWeb制作とマーケティングのノウハウを学べます。",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="relative z-10 mx-auto max-w-3xl px-4 py-16">
      <header className="mb-12">
        <p className="text-sm font-bold text-brand">Mikko ガイド</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          ブログ記事一覧
        </h1>
        <p className="mt-4 text-ink-soft">
          Web制作・マーケティング・AI活用のノウハウを、初心者にもわかりやすく解説します。
        </p>
      </header>

      <div className="space-y-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group rounded-2xl border border-line bg-surface p-6 transition-shadow hover:shadow-lg"
          >
            <Link href={`/blog/${post.slug}`}>
              <div className="flex flex-wrap items-center gap-3 text-xs text-ink-soft">
                <span className="rounded-full bg-brand-soft px-2.5 py-1 font-semibold text-brand">
                  {post.category}
                </span>
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>読了 {post.readingTime}</span>
              </div>
              <h2 className="mt-3 text-xl font-bold text-ink transition-colors group-hover:text-brand">
                {post.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {post.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs text-ink-soft">
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
