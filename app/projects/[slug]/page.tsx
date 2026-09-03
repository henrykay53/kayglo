import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectStack } from "@/components/ProjectStack";
import { Reveal } from "@/components/Reveal";
import { Button, Container, Kicker } from "@/components/ui";
import { projects, site } from "@/lib/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const title = `${project.name} — ${project.system}`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${title} · ${site.name}`,
      description: project.summary,
      url: `/projects/${project.slug}`,
      images: [{ url: project.gallery[0].src }],
    },
  };
}

/** A labelled block of the case study — the order buyers ask in. */
function Chapter({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className="border-t border-ink/10 pt-8">
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="font-display text-sm text-accent">{n}</p>
          <h2 className="font-display mt-2 text-2xl text-ink">{title}</h2>
        </div>
        <div className="md:col-span-7 md:col-start-6">{children}</div>
      </div>
    </Reveal>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const { study } = project;
  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <>
      {/* ------------------------------ HERO ------------------------------ */}
      <section className="border-b border-ink/10">
        <Container className="grid items-center gap-12 py-14 md:grid-cols-12 md:py-20">
          <div className="md:col-span-6">
            <Reveal>
              <Link
                href="/projects"
                className="kicker text-mute transition-colors hover:text-accent"
              >
                ← All projects
              </Link>
            </Reveal>
            <Reveal delay={80}>
              <p className="mt-8 text-sm text-mute">{project.location}</p>
              <h1 className="font-display mt-2 text-4xl leading-tight text-ink sm:text-5xl">
                {project.name}
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-4 text-lg font-medium text-accent">
                {project.system}
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 text-lg leading-relaxed text-slate">
                {project.summary}
              </p>
            </Reveal>
            <Reveal delay={260}>
              <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-ink/10 pt-6">
                {project.metrics.map((m) => (
                  <div key={m.label}>
                    <dt className="text-xs text-mute">{m.label}</dt>
                    <dd className="font-display mt-1 text-2xl text-ink">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
          <Reveal delay={120} className="md:col-span-6">
            <ProjectStack
              photos={project.gallery}
              label={project.name}
              sizes="(min-width: 768px) 46vw, 92vw"
            />
          </Reveal>
        </Container>
      </section>

      {/* --------------------------- CASE STUDY --------------------------- */}
      {study ? (
        <section className="py-16 md:py-24">
          <Container className="flex flex-col gap-12">
            <Reveal>
              <Kicker>The case study</Kicker>
            </Reveal>

            <Chapter n="01" title="Before">
              <p className="text-lg leading-relaxed text-slate">
                {study.before}
              </p>
            </Chapter>

            <Chapter n="02" title="The problem">
              <p className="leading-relaxed text-slate">{study.problem}</p>
            </Chapter>

            <Chapter n="03" title="What they had">
              <p className="leading-relaxed text-slate">{study.existing}</p>
            </Chapter>

            <Chapter n="04" title="What it had to carry">
              <ul className="space-y-2.5">
                {study.needs.map((n) => (
                  <li key={n} className="flex items-start gap-3 text-slate">
                    <svg
                      viewBox="0 0 16 16"
                      className="mt-[6px] h-3.5 w-3.5 shrink-0 text-accent"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m3 8.5 3.2 3.2L13 5" />
                    </svg>
                    {n}
                  </li>
                ))}
              </ul>
            </Chapter>

            <Chapter n="05" title="What we installed">
              <ul className="divide-y divide-ink/10 border-y border-ink/10">
                {study.installed.map((item) => (
                  <li key={item} className="py-3.5 text-slate">
                    {item}
                  </li>
                ))}
              </ul>
            </Chapter>

            <Chapter n="06" title="The installation">
              <p className="leading-relaxed text-slate">{study.install}</p>
            </Chapter>

            <Chapter n="07" title="After">
              <p className="text-lg leading-relaxed text-slate">
                {study.after}
              </p>
            </Chapter>

            {study.quote && (
              <Reveal className="border-t border-ink/10 pt-10">
                <figure className="mx-auto max-w-3xl text-center">
                  <blockquote className="font-display text-2xl leading-snug text-ink md:text-3xl">
                    &ldquo;{study.quote.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 text-sm text-mute">
                    {study.quote.name}
                    {study.quote.role && ` · ${study.quote.role}`}
                  </figcaption>
                </figure>
              </Reveal>
            )}
          </Container>
        </section>
      ) : (
        <section className="py-16 md:py-24">
          <Container>
            <p className="max-w-xl text-slate">
              The full case study for this installation is being written up.
              In the meantime, the photographs above are all from site.
            </p>
          </Container>
        </section>
      )}

      {/* ---------------------------- NEXT UP ----------------------------- */}
      <section className="border-t border-ink/10 bg-cream-200/40 py-16 md:py-24">
        <Container>
          <Reveal>
            <Kicker>More work</Kicker>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {others.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <Link href={`/projects/${p.slug}`} className="group block">
                  <p className="text-sm text-mute">{p.location}</p>
                  <h3 className="font-display mt-1 text-xl text-ink transition-colors group-hover:text-accent">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate">{p.system}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ink py-20 text-center text-cream md:py-28">
        <Container>
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl">
              Your home or business could be next.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-cream/70">
              Tell us what you need to power, and we&apos;ll show you exactly
              how to end the blackouts for good.
            </p>
            <div className="mt-9 flex justify-center">
              <Button href="/contact">Get a free power assessment</Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
