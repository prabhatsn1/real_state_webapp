import type { Variants, BezierDefinition } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

export const cardHover: Variants = {
  rest: { y: 0, boxShadow: "0 2px 20px rgba(26,26,46,0.08)" },
  hover: {
    y: -8,
    boxShadow: "0 16px 48px rgba(26,26,46,0.18)",
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as BezierDefinition,
    },
  },
};

export const navbarVariants: Variants = {
  transparent: {
    backgroundColor: "rgba(26,26,46,0)",
    backdropFilter: "blur(0px)",
  },
  solid: {
    backgroundColor: "rgba(26,26,46,0.96)",
    backdropFilter: "blur(12px)",
  },
};
