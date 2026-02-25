"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/lib/i18n/navigation";
import TextReveal from "@/components/animations/TextReveal";
import { ArrowRight } from "lucide-react";

export default function BookSection() {
  const t = useTranslations("homepage.book");

  return (
    <section className="relative bg-background py-32 lg:py-40 overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-900/[0.04] blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Book visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex justify-center lg:justify-end"
            style={{ perspective: "1000px" }}
          >
            <div
              className="relative"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateY(-6deg) rotateX(2deg)",
              }}
            >
              {/* Book cover placeholder */}
              <div className="relative w-[280px] md:w-[320px] aspect-[3/4] bg-surface-light rounded-sm overflow-hidden shadow-2xl shadow-black/50">
                {/* Cover image */}
                <img
                  src="https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=640&q=80"
                  alt="Dans l'intimité des baleines"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Cover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                {/* Title text on cover */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-8">
                  <p className="font-mono text-[9px] tracking-[0.4em] text-gold/80 uppercase mb-2">
                    Eric Lamblin
                  </p>
                  <h3 className="font-serif text-xl text-white text-center font-medium leading-tight">
                    Dans l&apos;intimité
                    <br />
                    des baleines
                  </h3>
                </div>
                {/* Book spine effect */}
                <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-gradient-to-b from-white/10 via-white/5 to-white/10" />
              </div>

              {/* Shadow */}
              <div className="absolute -bottom-4 left-4 right-4 h-8 bg-black/40 blur-xl rounded-full" />
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <span className="font-mono text-xs tracking-[0.4em] text-gold/60 uppercase mb-6 block">
              Le Livre
            </span>
            <TextReveal
              text={t("heading")}
              as="h2"
              className="font-serif text-3xl sm:text-4xl lg:text-5xl text-text-primary font-medium leading-tight mb-8"
            />
            <p className="text-base lg:text-lg text-text-secondary font-sans leading-relaxed mb-10">
              {t("text")}
            </p>
            <Link
              href="/book"
              className="group inline-flex items-center gap-3 font-sans text-sm uppercase tracking-[0.2em] text-gold hover:text-gold-light transition-colors duration-300"
            >
              <span>{t("cta")}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
