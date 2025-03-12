'use client';

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';

export type AnimateBy = 'words' | 'letters' | 'lines';
export type Direction = 'top' | 'bottom' | 'left' | 'right' | 'none';

// Typ generyczny T domyślnie to HTMLDivElement, ale można go nadpisać np. dla elementów SVG
export interface BlurTextProps<T extends Element = HTMLDivElement> {
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

export function BlurText<T extends Element = HTMLDivElement>({
  text,
  className,
  elementClassName,
  animateBy = 'words',
  direction = 'bottom',
  threshold = 0.1,
  rootMargin = '0px',
  once = true,
  delay = 0,
  staggerDelay = 50,
  duration = 800,
  blur = 10,
  distance = 20,
  easing = 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  onAnimationComplete,
  as: Component = 'p',
}: BlurTextProps<T>) {
  const containerRef = useRef<T>(null);
  const [elements, setElements] = useState<string[]>([]);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const animatedCount = useRef(0);

  const { inView } = useInView({
    ref: containerRef as React.RefObject<Element>,
    threshold,
    rootMargin,
    once,
  });

  useEffect(() => {
    if (animateBy === 'words') {
      setElements(text.split(' '));
    } else if (animateBy === 'letters') {
      setElements(text.split(''));
    } else if (animateBy === 'lines') {
      setElements(text.split('\n'));
    }
  }, [text, animateBy]);

  useEffect(() => {
    if (isAnimationComplete && onAnimationComplete) {
      onAnimationComplete();
    }
  }, [isAnimationComplete, onAnimationComplete]);

  useEffect(() => {
    if (!inView) {
      animatedCount.current = 0;
      setIsAnimationComplete(false);
    }
  }, [inView]);

  const getTransform = (dir: Direction) => {
    switch (dir) {
      case 'top':
        return `translateY(-${distance}px)`;
      case 'bottom':
        return `translateY(${distance}px)`;
      case 'left':
        return `translateX(-${distance}px)`;
      case 'right':
        return `translateX(${distance}px)`;
      default:
        return 'translate(0, 0)';
    }
  };

  const handleElementAnimationComplete = () => {
    animatedCount.current += 1;
    if (animatedCount.current === elements.length) {
      setIsAnimationComplete(true);
    }
  };

  // Zamiast tworzyć oddzielny komponent z rzutowaniem, używamy React.createElement,
  // dzięki czemu JSX sam prawidłowo rozpozna przekazany typ oraz ref.
  return React.createElement(
    Component,
    { ref: containerRef, className: cn('flex flex-wrap', className) },
    elements.map((element, index) => (
      <span
        key={index}
        className={cn(
          'inline-block transition-all will-change-transform will-change-opacity will-change-filter',
          elementClassName
        )}
        style={{
          filter: inView ? 'blur(0)' : `blur(${blur}px)`,
          opacity: inView ? 1 : 0,
          transform: inView ? 'translate(0, 0)' : getTransform(direction),
          transition: `
              filter ${duration}ms ${easing} ${delay + index * staggerDelay}ms,
              opacity ${duration}ms ${easing} ${delay + index * staggerDelay}ms,
              transform ${duration}ms ${easing} ${delay + index * staggerDelay}ms
            `,
        }}>
        {element === ' ' ? '\u00A0' : element}
        {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
      </span>
    ))
  );
}
