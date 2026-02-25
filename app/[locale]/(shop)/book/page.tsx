import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { ArrowRight, BookOpen, Maximize, Globe } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import ScrollReveal from "@/components/animations/ScrollReveal";
import TextReveal from "@/components/animations/TextReveal";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "book" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

// Featured whale photos for the book section
const bookPhotos = [
  {
    src: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=800&q=80",
    alt: "Baleine a bosse sous l'eau",
  },
  {
    src: "https://images.unsplash.com/photo-1454991727061-be514eae86f7?w=800&q=80",
    alt: "Queue de baleine",
  },
  {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    alt: "Ocean Indien",
  },
  {
    src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    alt: "Plongee sous-marine",
  },
];

export default async function BookPage() {
  const t = await getTranslations("book");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pb-32 overflow-hidden">
        {/* Atmospheric background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-900/[0.03] blur-[150px]" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-gold/[0.02] blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Book cover with 3D perspective */}
            <FadeIn className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div style={{ perspective: "1200px" }}>
                <div
                  className="relative transform transition-transform duration-700 hover:rotate-y-0"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "rotateY(-8deg) rotateX(3deg)",
                  }}
                >
                  {/* Book cover */}
                  <div className="relative w-[300px] sm:w-[340px] md:w-[380px] aspect-[3/4] rounded-sm overflow-hidden shadow-2xl shadow-black/60">
                    {/* Cover image */}
                    <Image
                      src="https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=800&q=80"
                      alt="Dans l'intimite des baleines - Couverture"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 300px, (max-width: 768px) 340px, 380px"
                      priority
                    />

                    {/* Cover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                    {/* Title on cover */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-10">
                      <p className="font-mono text-[10px] tracking-[0.5em] text-gold/80 uppercase mb-3">
                        Eric Lamblin
                      </p>
                      <h2 className="font-serif text-2xl sm:text-3xl text-white text-center font-medium leading-tight">
                        Dans l&apos;intimite
                        <br />
                        des baleines
                      </h2>
                    </div>

                    {/* Book spine effect */}
                    <div className="absolute top-0 left-0 bottom-0 w-[4px] bg-gradient-to-b from-white/15 via-white/5 to-white/15" />

                    {/* Top edge highlight */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
                  </div>

                  {/* Book shadow */}
                  <div className="absolute -bottom-6 left-6 right-6 h-10 bg-black/40 blur-2xl rounded-full" />

                  {/* Book pages effect (side) */}
                  <div className="absolute top-2 -right-[6px] bottom-2 w-[6px] bg-gradient-to-r from-neutral-200/20 to-neutral-400/10 rounded-r-sm">
                    <div className="absolute inset-0 flex flex-col justify-evenly">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-px bg-neutral-400/10"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Book info */}
            <div className="order-1 lg:order-2">
              <ScrollReveal preset="fadeUp">
                <span className="font-mono text-xs tracking-[0.4em] text-gold/60 uppercase mb-6 block">
                  Le Livre
                </span>
              </ScrollReveal>

              <TextReveal
                text={t("title")}
                as="h1"
                className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-medium leading-tight mb-4"
              />

              <ScrollReveal preset="fadeUp" delay={0.1}>
                <p className="font-serif text-xl text-text-secondary italic mb-8">
                  {t("subtitle")}
                </p>
              </ScrollReveal>

              <ScrollReveal preset="fadeUp" delay={0.2}>
                <p className="text-base lg:text-lg text-text-secondary font-sans leading-relaxed mb-6">
                  {t("description")}
                </p>
              </ScrollReveal>

              <ScrollReveal preset="fadeUp" delay={0.3}>
                <p className="text-base text-text-secondary font-sans leading-relaxed mb-10">
                  {t("description2")}
                </p>
              </ScrollReveal>

              {/* Book details */}
              <ScrollReveal preset="fadeUp" delay={0.35}>
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="flex items-center gap-3 bg-surface/50 rounded-lg px-4 py-3 border border-border/30">
                    <BookOpen className="w-4 h-4 text-gold/70 flex-shrink-0" />
                    <span className="font-sans text-sm text-text-secondary">
                      {t("pages")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-surface/50 rounded-lg px-4 py-3 border border-border/30">
                    <Maximize className="w-4 h-4 text-gold/70 flex-shrink-0" />
                    <span className="font-sans text-sm text-text-secondary">
                      {t("format")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-surface/50 rounded-lg px-4 py-3 border border-border/30">
                    <BookOpen className="w-4 h-4 text-gold/70 flex-shrink-0" />
                    <span className="font-sans text-sm text-text-secondary">
                      {t("cover")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-surface/50 rounded-lg px-4 py-3 border border-border/30">
                    <Globe className="w-4 h-4 text-gold/70 flex-shrink-0" />
                    <span className="font-sans text-sm text-text-secondary">
                      {t("language")}
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              {/* CTA */}
              <ScrollReveal preset="fadeUp" delay={0.4}>
                <a
                  href="#"
                  className="group inline-flex items-center gap-3 bg-gold hover:bg-gold-light text-background font-sans text-sm uppercase tracking-[0.15em] px-8 py-4 rounded-lg transition-colors duration-300"
                >
                  <span>{t("cta")}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Featured photos from the book */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Separator line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section header */}
          <FadeIn className="text-center mb-16">
            <span className="font-mono text-xs tracking-[0.4em] text-gold/60 uppercase mb-4 block">
              {t("featuredTitle")}
            </span>
            <p className="font-sans text-base text-text-muted max-w-lg mx-auto">
              {t("featuredSubtitle")}
            </p>
          </FadeIn>

          {/* Photo grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {bookPhotos.map((photo, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-surface">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-900/[0.03] blur-[120px]" />
        </div>

        <FadeIn className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium mb-6">
            {t("title")}
          </h2>
          <p className="font-sans text-lg text-text-secondary mb-10">
            {t("details")}
          </p>
          <a
            href="#"
            className="group inline-flex items-center gap-3 bg-gold hover:bg-gold-light text-background font-sans text-sm uppercase tracking-[0.15em] px-8 py-4 rounded-lg transition-colors duration-300"
          >
            <span>{t("cta")}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </FadeIn>
      </section>
    </div>
  );
}
