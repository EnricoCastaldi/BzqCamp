import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const slides = [
  { image: '/media/hero.webp', label: 'Dolomity', description: 'Grafitowy kamper na tle górskich szczytów' },
  { image: '/media/hero-coast.webp', label: 'Wybrzeże Atlantyku', description: 'Kamper na skalistym wybrzeżu o zachodzie słońca' },
  { image: '/media/hero-forest.webp', label: 'Północne lasy', description: 'Kamper w sosnowym lesie nad jeziorem' },
];

export default function HeroGallery() {
  const [active, setActive] = useState(0);

  const [playing, setPlaying] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    function respectMotion(event) {
      if (event.matches) setPlaying(false);
    }
    preference.addEventListener('change', respectMotion);
    return () => preference.removeEventListener('change', respectMotion);
  }, []);

  useEffect(() => {
    if (!playing || hovered) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive(index => (index + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [active, hovered, playing]);

  function move(offset) {
    setActive(index => (index + offset + slides.length) % slides.length);
  }

  return <div className="hero-gallery" role="region" aria-label="Galeria zdjęć kamperów">
    <div className="hero-photos" aria-hidden="true">
      {slides.map((slide, index) => <img
        key={slide.image}
        className={index === active ? 'hero-photo active' : 'hero-photo'}
        src={slide.image}
        alt=""
        fetchPriority={index === 0 ? 'high' : 'low'}
      />)}
    </div>
    <div className="gallery-bar wrap">
      <div className="gallery-controls" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <button className="icon gallery-step" type="button" aria-label="Poprzednie zdjęcie" onClick={() => move(-1)}><ChevronLeft size={20}/></button>
        <div className="gallery-caption">
          <span aria-hidden="true">{String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
          <strong>{slides[active].label}</strong>
        </div>
        <button className="icon gallery-step" type="button" aria-label="Następne zdjęcie" onClick={() => move(1)}><ChevronRight size={20}/></button>
        <button className="icon gallery-step" type="button" aria-label={playing ? 'Wstrzymaj pokaz zdjęć' : 'Wznów pokaz zdjęć'} onClick={() => setPlaying(value => !value)}>{playing ? <Pause size={17}/> : <Play size={17}/>}</button>
        <span className="sr-only" aria-live={playing ? 'off' : 'polite'}>{active + 1} z {slides.length}. {slides[active].label}. {slides[active].description}.</span>
      </div>
    </div>
  </div>;
}
