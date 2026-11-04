import type { Metadata } from "next";
import Link from "next/link";
import { ProjectStack } from "@/components/ProjectStack";
import { Reveal } from "@/components/Reveal";
import { Container, Kicker } from "@/components/ui";
import { PhotoCta } from "@/components/Sections";
import { projects } from "@/lib/site";

export const metadata: Metadata = {
  title: "Solar Projects & Case Studies",
  description:
    "Kayglo Citadel solar and battery installations for Nigerian homes and businesses — what each one replaced, the system we installed, and the results.",
  alternates: { canonical: "/projects" },
};


export default function ProjectsPage() {
  return (
    <>
      <section className="border-b border-ink/10">
        <Container className="py-20 md:py-28">
          <Reveal>
            <Kicker>Selected work</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 max-w-3xl text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
              Real homes and businesses. Real power. Real savings.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg text-slate">
              Every system is sized from scratch for the people who use it. Here
              are a few we&apos;re proud of — generators retired and diesel
              bills cut.
            </p>
          </Reveal>
        </Container>
      </section>
      

      {projects.map((p, i) => (
        <section
          key={p.slug}
          id={p.slug}
          className={`scroll-mt-24 ${i % 2 === 1 ? "bg-cream-200/50" : ""}`}
        >
          <Container className="grid items-center gap-10 py-16 md:grid-cols-2 md:gap-14 md:py-24">
            <Reveal className={i % 2 === 1 ? "md:order-2" : ""}>
              <ProjectStack photos={p.gallery} label={p.name} />
            </Reveal>
            <Reveal delay={100} className={i % 2 === 1 ? "md:order-1" : ""}>
              <p className="text-sm text-mute">{p.location}</p>
              <h2 className="font-display mt-1 text-3xl text-ink md:text-4xl">
                {p.name}
              </h2>
              <p className="mt-3 font-medium text-accent">{p.system}</p>
              <p className="mt-5 text-lg text-slate">{p.summary}</p>
              <Link
                href={`/projects/${p.slug}`}
                className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-accent"
              >
                Read the full case study
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </Reveal>
          </Container>
        </section>
      ))}

      <PhotoCta
        title="Your home or business could be next."
        body="Tell us what you need to power, and we'll show you exactly how to end the blackouts for good."
      />
    </>
  );
}
