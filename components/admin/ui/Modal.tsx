"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./Button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  confirmVariant?: "primary" | "danger";
  cancelLabel?: string;
  loading?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  onConfirm,
  confirmLabel = "Confirmer",
  confirmVariant = "primary",
  cancelLabel = "Annuler",
  loading,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    },
    [onClose, loading]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={!loading ? onClose : undefined}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-surface border border-border rounded-lg shadow-2xl shadow-black/30"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 pb-0">
              <div>
                <h3 className="font-serif text-lg font-semibold text-text-primary">
                  {title}
                </h3>
                {description && (
                  <p className="mt-1.5 text-sm text-text-muted leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                className="p-1 -mr-1 -mt-1 text-text-muted hover:text-text-primary transition-colors rounded hover:bg-surface-light disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            {children && <div className="p-5">{children}</div>}

            {/* Footer */}
            {onConfirm && (
              <div className="flex items-center justify-end gap-3 p-5 pt-4 border-t border-border">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onClose}
                  disabled={loading}
                >
                  {cancelLabel}
                </Button>
                <Button
                  variant={confirmVariant}
                  size="sm"
                  onClick={onConfirm}
                  loading={loading}
                >
                  {confirmLabel}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
