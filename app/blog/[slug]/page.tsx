import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://micro-saas-xi.vercel.app"}/blog/${post.slug}`,
      siteName: "Mikko",
      locale: "ja_JP",
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className="relative z-10 mx-auto max-w-3xl px-4 py-16">
      <article>
        <header className="mb-10 border-b border-line pb-8">
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
          <h1 className="mt-4 text-2xl font-extrabold leading-snug tracking-tight text-ink sm:text-3xl">
            {post.title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">{post.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-line/60 px-2.5 py-1 text-xs text-ink-soft">
                #{tag}
              </span>
            ))}
          </div>
        </header>

        <div className="space-y-8">
          {post.sections.map((section, i) => (
            <section key={i}>
              {section.heading && (
                <h2 className="mb-3 text-xl font-bold text-ink">{section.heading}</h2>
              )}
              {section.paragraphs.map((p, j) => (
                <p key={j} className="mb-4 leading-relaxed text-ink/90">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>

      <div className="mt-14 rounded-2xl border border-line bg-brand-soft/50 p-6 text-center">
        <p className="text-sm font-bold text-ink">この記事の内容に合うツールを使ってみる</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/brandkit"
            className="rounded-full bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1d4ed8]"
          >
            BrandKit を試す
          </Link>
          <Link
            href="/contentpilot"
            className="rounded-full border border-brand px-5 py-2.5 text-sm font-bold text-brand transition hover:bg-brand-soft"
          >
            ContentPilot を試す
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <Link href="/blog" className="text-sm font-semibold text-brand hover:underline">
          ← 記事一覧に戻る
        </Link>
      </div>
    </main>
  );
}
