"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations/variants";
import { Award, Truck, Star, ShieldCheck } from "lucide-react";

const ICONS = [Award, Truck, Star, ShieldCheck];
const KEYS = ["quality", "shipping", "limited", "satisfaction"] as const;

export default function ReassuranceBanner() {
  const t = useTranslations("homepage.reassurance");

  return (
    <section className="relative border-t border-border/30 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-20">
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12"
        >
          {KEYS.map((key, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={key}
                variants={staggerItemVariants}
                className="flex flex-col items-center text-center group"
              >
                <div className="mb-4 p-3 rounded-full border border-border/40 group-hover:border-gold/30 transition-colors duration-500">
                  <Icon className="w-5 h-5 text-gold/60 group-hover:text-gold transition-colors duration-500" />
                </div>
                <p className="font-sans text-sm text-text-secondary leading-snug">
                  {t(key)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
