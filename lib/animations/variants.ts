import type { Variants } from "framer-motion";

// Card hover effect
export const cardHoverVariants: Variants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

// Stagger container
export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

// Stagger item
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

// Page transition
export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

// Fade in on viewport entry
export const fadeInViewVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] },
  },
};

// Scale in
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
  },
};

// Card stack positions (for featured photos carousel)
export const cardStackPositions = {
  center: { x: 0, y: 0, scale: 1, rotateZ: 0, zIndex: 10, opacity: 1 },
  left1: {
    x: -120,
    y: 10,
    scale: 0.92,
    rotateZ: -6,
    zIndex: 5,
    opacity: 0.8,
  },
  left2: {
    x: -200,
    y: 20,
    scale: 0.84,
    rotateZ: -12,
    zIndex: 1,
    opacity: 0.5,
  },
  right1: {
    x: 120,
    y: 10,
    scale: 0.92,
    rotateZ: 6,
    zIndex: 5,
    opacity: 0.8,
  },
  right2: {
    x: 200,
    y: 20,
    scale: 0.84,
    rotateZ: 12,
    zIndex: 1,
    opacity: 0.5,
  },
};
