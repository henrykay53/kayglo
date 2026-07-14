import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Container, Kicker } from "@/components/ui";
import { formatDate, getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Insights — Solar Guides & Advice",
  description:
    "Clear, honest guidance on going solar in Nigeria: what a system costs, how to spot genuine equipment, solar vs generator, and more. From the Kayglo Citadel team.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const [lead, ...rest] = posts;

  return (
    <>
      <section className="border-b border-ink/10">
        <Container className="py-20 md:py-28">
          <Reveal>
            <Kicker>Insights</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 max-w-3xl text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
              Straight answers about going solar.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg text-slate">
              No jargon, no hard sell — just the guidance we&apos;d give a friend
              weighing a system for their own home.
            </p>
          </Reveal>
        </Container>
      </section>

      {posts.length === 0 ? (
        <Container className="py-24">
          <p className="text-slate">New articles are on the way.</p>
        </Container>
      ) : (
        <Container className="py-16 md:py-24">
          {/* Featured post */}
          {lead && (
            <Reveal>
              <Link
                href={`/blog/${lead.slug}`}
                className="group grid gap-8 rounded-3xl border border-ink/10 bg-cream-200/40 p-8 transition-shadow hover:shadow-xl hover:shadow-ink/10 md:grid-cols-2 md:p-12"
              >
                <div>
                  <span className="kicker text-gold">{lead.category}</span>
                  <h2 className="font-display mt-4 text-3xl text-ink md:text-4xl">
                    {lead.title}
                  </h2>
                </div>
                <div className="flex flex-col justify-between">
                  <p className="text-lg text-slate">{lead.description}</p>
                  <p className="mt-6 text-sm text-mute">
                    {formatDate(lead.date)} · {lead.readingTime} min read
                  </p>
                </div>
              </Link>
            </Reveal>
          )}

          {/* Rest */}
          {rest.length > 0 && (
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {rest.map((post, i) => (
                <Reveal key={post.slug} delay={i * 80}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-cream p-8 transition-shadow hover:shadow-lg hover:shadow-ink/10"
                  >
                    <span className="kicker text-gold">{post.category}</span>
                    <h2 className="font-display mt-4 text-2xl text-ink group-hover:text-gold">
                      {post.title}
                    </h2>
                    <p className="mt-3 flex-1 text-slate">{post.description}</p>
                    <p className="mt-6 text-sm text-mute">
                      {formatDate(post.date)} · {post.readingTime} min read
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      )}

      <section className="bg-ink py-16 text-center text-cream md:py-20">
        <Container>
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl">
              Questions about your own home or business?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-cream/70">
              Talk to real people who understand Nigerian power — no pressure, no
              obligation.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/contact"
                className="rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-cream hover:text-ink"
              >
                Get a free quote →
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <p className="sr-only">Serving {site.areasServed.join(", ")}.</p>
    </>
  );
}
