'use client';
import { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, AnimationControls } from 'framer-motion';

interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, any>;
  animationTo?: Record<string, any>[];
  easing?: string | number | number[];
  onAnimationComplete?: () => void;
}

interface AnimatedLetterProps {
  content: string;
  inView: boolean;
  delay: number;
  animationFrom: Record<string, any>;
  animationSteps: Record<string, any>[];
  easing: string | number | number[];
  onComplete?: () => void;
}

const AnimatedLetter: React.FC<AnimatedLetterProps> = ({
  content,
  inView,
  delay,
  animationFrom,
  animationSteps,
  easing,
  onComplete,
}) => {
  const controls: AnimationControls = useAnimation();

  useEffect(() => {
    if (inView) {
      (async () => {
        // Poczekaj na opóźnienie przypisane do danego elementu
        await new Promise((res) => setTimeout(res, delay));
        // Przejdź przez wszystkie etapy animacji
        for (const step of animationSteps) {
          await controls.start({
            ...step,
            transition: { ease: easing, duration: 0.5 },
          });
        }
        if (onComplete) onComplete();
      })();
    }
  }, [inView, delay, animationSteps, controls, easing, onComplete]);

  return (
    <motion.span
      initial={animationFrom}
      animate={controls}
      className='inline-block transition-transform will-change-[transform,filter,opacity]'>
      {content}
    </motion.span>
  );
};

const BlurText: React.FC<BlurTextProps> = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = 'easeOut',
  onAnimationComplete,
}) => {
  // Rozdziel tekst na słowa lub litery
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const animatedCount = useRef(0);

  // Domyślny stan początkowy – wykorzystujemy właściwość "y" zamiast pełnego translate3d
  const defaultFrom =
    animationFrom ||
    (direction === 'top'
      ? { filter: 'blur(10px)', opacity: 0, y: -50 }
      : { filter: 'blur(10px)', opacity: 0, y: 50 });

  // Domyślna sekwencja animacji – pierwszy krok to zmniejszenie rozmycia i zwiększenie przezroczystości, drugi krok ustawia ostateczny stan
  const defaultTo = animationTo || [
    {
      filter: 'blur(5px)',
      opacity: 0.5,
      y: direction === 'top' ? 5 : -5,
    },
    { filter: 'blur(0px)', opacity: 1, y: 0 },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const handleLetterComplete = () => {
    animatedCount.current += 1;
    if (animatedCount.current === elements.length && onAnimationComplete) {
      onAnimationComplete();
    }
  };

  return (
    <p ref={ref} className={`blur-text ${className} flex flex-wrap`}>
      {elements.map((el, index) => {
        // W przypadku animacji według słów, dodajemy spację na końcu każdego słowa (oprócz ostatniego)
        const content =
          animateBy === 'words' && index < elements.length - 1
            ? el + '\u00A0'
            : el;
        return (
          <AnimatedLetter
            key={index}
            content={content}
            inView={inView}
            delay={index * delay}
            animationFrom={defaultFrom}
            animationSteps={defaultTo}
            easing={easing}
            onComplete={handleLetterComplete}
          />
        );
      })}
    </p>
  );
};

export default BlurText;
