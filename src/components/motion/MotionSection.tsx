"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { Variants } from "framer-motion";
import { fadeUp } from "@/animations/variants";
import type { ReactNode } from "react";

interface MotionSectionProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  once?: boolean;
  as?: "section" | "div" | "article" | "aside";
}

export default function MotionSection({
  children,
  variants = fadeUp,
  className,
  delay = 0,
  once = true,
  as: Tag = "section",
}: MotionSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    margin: "-80px",
  });

  const MotionTag = motion[Tag] as React.ComponentType<
    React.HTMLAttributes<HTMLElement> & {
      ref?: React.Ref<HTMLDivElement>;
      initial?: unknown;
      animate?: unknown;
      variants?: unknown;
    }
  >;

  return (
    <MotionTag
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        ...variants,
        visible: {
          ...(typeof variants.visible === "object" ? variants.visible : {}),
          transition: {
            ...(typeof variants.visible === "object" &&
            "transition" in variants.visible
              ? (variants.visible as { transition?: object }).transition
              : {}),
            delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
