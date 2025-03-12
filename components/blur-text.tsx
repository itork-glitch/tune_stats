"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/use-in-view";

export type AnimateBy = "words" | "letters" | "lines";
export type Direction = "top" | "bottom" | "left" | "right" | "none";

export interface BlurTextProps {
  text: string;
  className?: string;
  elementClassName?: string;
  animateBy?: AnimateBy;
  direction?: Direction;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  delay?: number;
  staggerDelay?: number;
  duration?: number;
  blur?: number;
  distance?: number;
  easing?: string;
  onAnimationComplete?: () => void;
  as?: React.ElementType;
}

export function BlurText({
  text,
  className,
  elementClassName,
  animateBy = "words",
  direction = "bottom",
  threshold = 0.1,
  rootMargin = "0px",
  once = true,
  delay = 0,
  staggerDelay = 50,
  duration = 800,
  blur = 10,
  distance = 20,
  easing = "cubic-bezier(0.25, 0.1, 0.25, 1)",
  onAnimationComplete,
  as: Component = "p",
}: BlurTextProps) {
  const containerRef = useRef<HTMLDivElement>(null); // Change here to HTMLDivElement
  const [elements, setElements] = useState<string[]>([]);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const animatedCount = useRef(0);

  const { inView } = useInView({
    ref: containerRef,
    threshold,
    rootMargin,
    once,
  });

  // Split text based on animateBy prop
  useEffect(() => {
    if (animateBy === "words") {
      setElements(text.split(" "));
    } else if (animateBy === "letters") {
      setElements(text.split(""));
    } else if (animateBy === "lines") {
      setElements(text.split("\n"));
    }
  }, [text, animateBy]);

  // Handle animation completion
  useEffect(() => {
    if (isAnimationComplete && onAnimationComplete) {
      onAnimationComplete();
    }
  }, [isAnimationComplete, onAnimationComplete]);

  // Reset animation counter when inView changes
  useEffect(() => {
    if (!inView) {
      animatedCount.current = 0;
      setIsAnimationComplete(false);
    }
  }, [inView]);

  // Get transform based on direction
  const getTransform = (dir: Direction) => {
    switch (dir) {
      case "top":
        return `translateY(-${distance}px)`;
      case "bottom":
        return `translateY(${distance}px)`;
      case "left":
        return `translateX(-${distance}px)`;
      case "right":
        return `translateX(${distance}px)`;
      default:
        return "translate(0, 0)";
    }
  };

  // Handle individual element animation completion
  const handleElementAnimationComplete = () => {
    animatedCount.current += 1;
    if (animatedCount.current === elements.length) {
      setIsAnimationComplete(true);
    }
  };

  return (
    <Component ref={containerRef} className={cn("flex flex-wrap", className)}>
      {elements.map((element, index) => (
        <span
          key={index}
          className={cn(
            "inline-block transition-all will-change-transform will-change-opacity will-change-filter",
            elementClassName
          )}
          style={{
            filter: inView ? "blur(0)" : `blur(${blur}px)`,
            opacity: inView ? 1 : 0,
            transform: inView ? "translate(0, 0)" : getTransform(direction),
            transition: `
              filter ${duration}ms ${easing} ${delay + index * staggerDelay}ms,
              opacity ${duration}ms ${easing} ${delay + index * staggerDelay}ms,
              transform ${duration}ms ${easing} ${delay + index * staggerDelay}ms
            `,
          }}
        >
          {element === " " ? "\u00A0" : element}
          {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
        </span>
      ))}
    </Component>
  );
}
