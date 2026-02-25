"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/lib/i18n/navigation";
import MockupTemplate from "@/components/mockup/MockupTemplate";
import { MOCKUP_TEMPLATES } from "@/lib/mockup/templates";
import TextReveal from "@/components/animations/TextReveal";
import { ArrowRight } from "lucide-react";

// Demo photo URL for the mockup preview
const DEMO_PHOTO_URL =
  "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=800&q=80";

export default function MockupPreviewSection({
  photoUrl,
}: {
  photoUrl?: string;
}) {
  const t = useTranslations("homepage.mockupPreview");

  // Show 3 mockup templates (S, M, L)
  const previewTemplates = MOCKUP_TEMPLATES.slice(0, 3);

  return (
    <section className="relative bg-surface py-32 lg:py-40 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        {/* Atmospheric glow */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-gold/[0.015] blur-[150px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 lg:mb-24 max-w-2xl">
          <span className="font-mono text-xs tracking-[0.4em] text-gold/60 uppercase mb-4 block">
            Visualisation
          </span>
          <TextReveal
            text={t("heading")}
            as="h2"
            className="font-serif text-4xl sm:text-5xl lg:text-6xl text-text-primary font-medium mb-6"
          />
          <p className="text-base lg:text-lg text-text-secondary font-sans leading-relaxed">
            {t("text")}
          </p>
        </div>

        {/* Mockup Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {previewTemplates.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ y: 60, opacity: 0, scale: 0.95 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.8,
                delay: i * 0.15,
                ease: [0.25, 0.4, 0.25, 1],
              }}
            >
              <MockupTemplate
                template={template}
                photoUrl={photoUrl || DEMO_PHOTO_URL}
                photoAlt="Photo de baleine — prévisualisation mockup"
                sizeLabel={
                  template.sizeName === "S"
                    ? "20×30 cm"
                    : template.sizeName === "M"
                      ? "40×60 cm"
                      : "60×90 cm"
                }
                className="bg-surface-light rounded-lg overflow-hidden"
              />
              {/* Size label */}
              <div className="mt-3 text-center">
                <span className="font-mono text-xs tracking-[0.3em] text-text-muted uppercase">
                  Taille {template.sizeName}
                </span>
                <p className="text-sm text-text-secondary font-sans mt-1">
                  {template.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-3 border border-gold/30 hover:border-gold/60 px-8 py-3.5 text-sm font-sans uppercase tracking-[0.2em] text-gold hover:text-gold-light transition-all duration-500 backdrop-blur-sm"
          >
            <span>{t("cta")}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
