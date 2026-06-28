'use client';

import { useEffect, useRef, useState } from 'react';

const VARIANTS = {
  'fade-in': 'animate-fade-in',
  'slide-up': 'animate-slide-up',
  'slide-down': 'animate-slide-down',
  'scale-in': 'animate-scale-in',
};

export default function AnimateIn({
  children,
  variant = 'slide-up',
  delay = 0,
  className = '',
  as: Tag = 'div',
  once = true,
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px',
  immediate = false,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduceMotion(prefersReduced);

    if (prefersReduced || immediate) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate, once, threshold, rootMargin]);

  const animationClass = visible
    ? reduceMotion
      ? ''
      : VARIANTS[variant] ?? VARIANTS['slide-up']
    : 'opacity-0';

  const style =
    visible && delay > 0 && !reduceMotion
      ? { animationDelay: `${delay}ms`, animationFillMode: 'both' }
      : visible && !reduceMotion
        ? { animationFillMode: 'both' }
        : undefined;

  return (
    <Tag ref={ref} className={[animationClass, className].filter(Boolean).join(' ')} style={style}>
      {children}
    </Tag>
  );
}
