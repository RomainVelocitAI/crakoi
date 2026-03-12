import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import ScrollReveal from "@/components/animations/ScrollReveal";
import TextReveal from "@/components/animations/TextReveal";
import ParallaxImage from "@/components/animations/ParallaxImage";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("bio1"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero banner */}
      <section className="relative h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
          alt="Ocean Indien - La Reunion"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />

        {/* Hero content */}
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-16 lg:pb-20 w-full">
            <span className="font-mono text-xs tracking-[0.4em] text-gold/70 uppercase mb-4 block">
              Le Photographe
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-text-primary font-medium leading-tight">
              {t("title")}
            </h1>
            <p className="font-serif text-xl sm:text-2xl text-text-secondary/80 mt-4 italic">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Bio Section 1 */}
      <section className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Text */}
            <ScrollReveal preset="fadeUp">
              <p className="font-sans text-lg lg:text-xl text-text-secondary leading-relaxed">
                {t("bio1")}
              </p>
            </ScrollReveal>

            {/* Photo */}
            <FadeIn delay={0.2}>
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-surface">
                <Image
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"
                  alt="Eric Lamblin - photographe sous-marin"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Parallax divider */}
      <ParallaxImage
        src="https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=1920&q=80"
        alt="Baleine a bosse - La Reunion"
        speed={0.4}
        className="h-[50vh] min-h-[300px]"
      />

      {/* Bio Section 2 */}
      <section className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Photo */}
            <FadeIn className="order-2 lg:order-1">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-surface">
                <Image
                  src="https://images.unsplash.com/photo-1454991727061-be514eae86f7?w=800&q=80"
                  alt="Photographie sous-marine"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </FadeIn>

            {/* Text */}
            <ScrollReveal preset="fadeUp" className="order-1 lg:order-2">
              <p className="font-sans text-lg lg:text-xl text-text-secondary leading-relaxed">
                {t("bio2")}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Parallax divider 2 */}
      <ParallaxImage
        src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80"
        alt="Ocean au coucher du soleil"
        speed={0.3}
        className="h-[40vh] min-h-[250px]"
      />

      {/* Bio Section 3 + CTA */}
      <section className="relative py-24 lg:py-32">
        {/* Atmospheric background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-gold/[0.02] blur-[120px]" />
        </div>

        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <ScrollReveal preset="fadeUp">
            <p className="font-sans text-lg lg:text-xl text-text-secondary leading-relaxed mb-12">
              {t("bio3")}
            </p>
          </ScrollReveal>

          <FadeIn delay={0.2}>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mx-auto mb-12" />
          </FadeIn>

          <FadeIn delay={0.3}>
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-3 bg-gold hover:bg-gold-light text-background font-sans text-sm uppercase tracking-[0.15em] px-8 py-4 rounded-lg transition-colors duration-300"
            >
              <span>{t("cta")}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
