"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Mail, Clock, Send, CheckCircle, ArrowRight } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const inputClassName =
    "w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/50 transition-colors font-sans";

  return (
    <div className="min-h-screen pt-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-20">
        {/* Page header */}
        <FadeIn className="mb-16 lg:mb-20">
          <span className="font-mono text-xs tracking-[0.4em] text-gold/60 uppercase mb-4 block">
            {t("title")}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-text-primary font-medium leading-tight mb-6">
            {t("title")}
          </h1>
          <p className="font-sans text-lg text-text-secondary max-w-2xl">
            {t("subtitle")}
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left column: Contact info */}
          <div className="lg:col-span-2">
            <FadeIn delay={0.1}>
              <div className="space-y-8">
                {/* Info title */}
                <h2 className="font-serif text-xl text-text-primary font-medium">
                  {t("infoTitle")}
                </h2>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center flex-shrink-0 border border-border/50">
                    <MapPin className="w-4 h-4 text-gold/70" />
                  </div>
                  <div>
                    <p className="font-sans text-sm text-text-muted uppercase tracking-wider mb-1">
                      Location
                    </p>
                    <p className="font-sans text-base text-text-secondary">
                      {t("location")}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center flex-shrink-0 border border-border/50">
                    <Mail className="w-4 h-4 text-gold/70" />
                  </div>
                  <div>
                    <p className="font-sans text-sm text-text-muted uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${t("emailAddress")}`}
                      className="font-sans text-base text-text-secondary hover:text-gold transition-colors duration-300"
                    >
                      {t("emailAddress")}
                    </a>
                  </div>
                </div>

                {/* Response time */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center flex-shrink-0 border border-border/50">
                    <Clock className="w-4 h-4 text-gold/70" />
                  </div>
                  <div>
                    <p className="font-sans text-sm text-text-muted uppercase tracking-wider mb-1">
                      {t("responseTime")}
                    </p>
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="mt-8 relative aspect-[4/3] rounded-xl overflow-hidden bg-surface border border-border/50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-text-muted/30 mx-auto mb-3" />
                      <p className="font-sans text-sm text-text-muted">
                        La Reunion, France
                      </p>
                      <p className="font-sans text-xs text-text-muted/50 mt-1">
                        -21.1151, 55.5364
                      </p>
                    </div>
                  </div>
                  {/* Faux map grid lines */}
                  <div className="absolute inset-0 opacity-[0.03]">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={`h-${i}`}
                        className="absolute left-0 right-0 h-px bg-white"
                        style={{ top: `${(i + 1) * 10}%` }}
                      />
                    ))}
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={`v-${i}`}
                        className="absolute top-0 bottom-0 w-px bg-white"
                        style={{ left: `${(i + 1) * 10}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right column: Contact form */}
          <div className="lg:col-span-3">
            <FadeIn delay={0.2}>
              <div className="bg-surface/50 rounded-2xl p-6 sm:p-8 lg:p-10 border border-border/30">
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    /* Success state */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-green-900/20 flex items-center justify-center mb-6">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </div>
                      <h3 className="font-serif text-2xl text-text-primary font-medium mb-3">
                        {t("sent")}
                      </h3>
                      <p className="font-sans text-text-secondary mb-8 max-w-sm">
                        {t("sentText")}
                      </p>
                      <button
                        onClick={handleReset}
                        className="group inline-flex items-center gap-2 font-sans text-sm text-text-muted hover:text-gold transition-colors duration-300"
                      >
                        <ArrowRight className="w-4 h-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
                        <span>{t("backToForm")}</span>
                      </button>
                    </motion.div>
                  ) : (
                    /* Form */
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      {/* Name & Email row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="name"
                            className="block font-sans text-xs uppercase tracking-widest text-text-muted mb-2"
                          >
                            {t("name")}
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className={inputClassName}
                            placeholder="Eric Lamblin"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="email"
                            className="block font-sans text-xs uppercase tracking-widest text-text-muted mb-2"
                          >
                            {t("email")}
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className={inputClassName}
                            placeholder="email@example.com"
                          />
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label
                          htmlFor="subject"
                          className="block font-sans text-xs uppercase tracking-widest text-text-muted mb-2"
                        >
                          {t("subject")}
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className={inputClassName}
                          placeholder={t("subject")}
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <label
                          htmlFor="message"
                          className="block font-sans text-xs uppercase tracking-widest text-text-muted mb-2"
                        >
                          {t("message")}
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          className={`${inputClassName} resize-none`}
                          placeholder={t("message")}
                        />
                      </div>

                      {/* Submit button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gold hover:bg-gold-light disabled:bg-gold/50 disabled:cursor-not-allowed text-background font-sans text-sm uppercase tracking-[0.15em] px-8 py-4 rounded-lg transition-colors duration-300"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                            <span>{t("sending")}</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>{t("send")}</span>
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
