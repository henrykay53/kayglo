import { Button, Container } from "@/components/ui";
import { Mark } from "@/components/Brand";

export default function NotFound() {
  return (
    <section className="py-28 md:py-36">
      <Container className="max-w-xl text-center">
        <Mark className="mx-auto h-12 w-12 text-gold" />
        <p className="font-display mt-8 text-7xl text-ink">404</p>
        <h1 className="font-display mt-4 text-3xl text-ink">
          This page went off-grid.
        </h1>
        <p className="mt-4 text-slate">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s
          get you back to something bright.
        </p>
        <div className="mt-9 flex justify-center">
          <Button href="/">Back to home</Button>
        </div>
      </Container>
    </section>
  );
}
