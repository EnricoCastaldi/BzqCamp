import React, { useEffect, useRef, useState } from 'react';

import { Award, SlidersHorizontal, Wrench } from 'lucide-react';

const counters = [
  { value: 30, unit: ' lat', label: 'Doświadczenia', icon: Award },
  { value: 150, unit: '', label: 'Renowacji', icon: Wrench },
  { value: 85, unit: '', label: 'Konfiguracji', icon: SlidersHorizontal },
];

export default function HeroCounters() {
  const [progress, setProgress] = useState(1);
  const [shimmer, setShimmer] = useState(false);
  const strip = useRef(null);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || !('IntersectionObserver' in window)) return;
    let frame;
    const stop = () => {
      cancelAnimationFrame(frame);
      setProgress(1);
      setShimmer(false);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (preference.matches) return;
      const start = performance.now();
      function tick(now) {
        const elapsed = Math.min(1, (now - start) / 850);
        setProgress(1 - (1 - elapsed) ** 3);
        if (elapsed < 1) frame = requestAnimationFrame(tick);
        else setShimmer(true);
      }
      setProgress(0);
      frame = requestAnimationFrame(tick);
    });
    observer.observe(strip.current);
    preference.addEventListener('change', stop);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      preference.removeEventListener('change', stop);
    };
  }, []);

  return <dl className="hero-counters wrap" data-shimmer={shimmer ? "" : undefined} ref={strip}>
    {counters.map(({ value, unit, label, icon: Icon }) => <div key={label}>
      <dt><Icon className="hero-counter-icon" strokeWidth={1.5} aria-hidden="true"/>{label}</dt>
      <dd><span className="hero-counter-reading" aria-hidden="true"><span className="hero-counter-number" data-value={value}>{Math.round(value * progress)}</span><small>{unit}</small></span><span className="sr-only">{value}{unit}</span></dd>
    </div>)}
  </dl>;
}
