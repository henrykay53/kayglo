import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Container, Kicker } from "@/components/ui";
import { publishedTestimonials, type Testimonial } from "@/lib/site";

/**
 * Video first — a customer saying the numbers out loud is the strongest proof
 * a solar company can publish (§26). Falls back to the written quote when
 * there is no footage yet.
 */
function Player({ video, author }: { video: NonNullable<Testimonial["video"]>; author: string }) {
  if (video.youtube) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl bg-ink-800">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtube}`}
          title={`${author} — customer testimonial`}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }
  if (!video.src) return null;
  return (
    <video
      controls
      preload="metadata"
      poster={video.poster}
      className="aspect-video w-full rounded-xl bg-ink-800 object-cover"
      aria-label={`${author} — customer testimonial`}
    >
      <source src={video.src} />
    </video>
  );
}

export function Testimonials() {
  const items = publishedTestimonials();
  // Nothing verified yet? Then the section simply isn't there. Better an
  // absent testimonial than an invented one.
  if (items.length === 0) return null;

  const featured = items.find((t) => t.video);
  const rest = items.filter((t) => t !== featured);

  return (
    <section className="py-20 md:py-28">
      <Container>
        <Reveal>
          <Kicker>In their words</Kicker>
        </Reveal>

        {featured && (
          <Reveal delay={80}>
            <div className="mt-12 grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <Player video={featured.video!} author={featured.author} />
              <figure>
                <blockquote className="font-display text-2xl leading-snug text-ink md:text-3xl">
                  &ldquo;{featured.quote}&rdquo;
                </blockquote>
                {featured.detail && (
                  <p className="mt-5 text-slate">{featured.detail}</p>
                )}
                <figcaption className="mt-6 text-sm">
                  <span className="font-medium text-ink">{featured.author}</span>
                  <span className="text-mute"> · {featured.location}</span>
                  {featured.project && (
                    <>
                      {" · "}
                      <Link
                        href={`/projects/${featured.project}`}
                        className="link-underline text-accent"
                      >
                        See the installation
                      </Link>
                    </>
                  )}
                </figcaption>
              </figure>
            </div>
          </Reveal>
        )}

        {rest.length > 0 && (
          <div
            className={`grid gap-8 ${featured ? "mt-14" : "mt-12"} ${
              rest.length === 1
                ? "md:grid-cols-1"
                : rest.length === 2
                  ? "md:grid-cols-2"
                  : "md:grid-cols-3"
            }`}
          >
            {rest.map((t, i) => (
              <Reveal key={t.author} delay={i * 90}>
                <figure className="flex h-full flex-col rounded-2xl border border-ink/10 bg-cream p-8">
                  {t.video && (
                    <div className="mb-6">
                      <Player video={t.video} author={t.author} />
                    </div>
                  )}
                  <blockquote className="font-display flex-1 text-lg leading-snug text-ink">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  {t.detail && <p className="mt-4 text-sm text-slate">{t.detail}</p>}
                  <figcaption className="mt-6 text-sm">
                    <span className="font-medium text-ink">{t.author}</span>
                    <span className="text-mute"> · {t.location}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
