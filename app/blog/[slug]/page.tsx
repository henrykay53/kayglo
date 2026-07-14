import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { formatDate, getPost, getPostSlugs } from "@/lib/posts";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: site.legalName,
      logo: { "@type": "ImageObject", url: `${site.url}/icon.svg` },
    },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <article className="py-14 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container className="max-w-2xl">
        <Link
          href="/blog"
          className="link-underline text-sm text-mute hover:text-ink"
        >
          ← All insights
        </Link>

        <header className="mt-8">
          <span className="kicker text-gold">{post.category}</span>
          <h1 className="font-display mt-4 text-4xl leading-tight text-ink md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-sm text-mute">
            By {post.author} · {formatDate(post.date)} · {post.readingTime} min
            read
          </p>
        </header>

        <div
          className="prose prose-kayglo mt-10 max-w-none prose-lg prose-headings:font-medium prose-a:font-medium"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <div className="mt-14 rounded-2xl border border-ink/10 bg-cream-200/50 p-8 text-center">
          <h2 className="font-display text-2xl text-ink">
            Thinking about solar for your home?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-slate">
            Get an honest, itemized proposal built around your home — usually
            within a week.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-gold"
          >
            Get a free quote →
          </Link>
        </div>
      </Container>
    </article>
  );
}
