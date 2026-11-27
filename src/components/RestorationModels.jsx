import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';

const models = [
  { title: 'Niewiadów N126', image: 'niewiadow-n126.webp', description: 'Klasyczna przyczepa pokazana w zestawie z Polskim Fiatem.', author: 'Michał Derela', file: 'Niewiadów_N126_trailer_164256.jpg', license: '4.0' },
  { title: 'Niewiadów N126b', image: 'niewiadow-n126b-road.webp', description: 'Egzemplarz z 1979 roku z lekko zmodyfikowanymi tylnymi światłami.', author: 'Faraday16', file: 'Skoda_Felicia_i_Niewiadow_N126n.jpg', license: '3.0' },
  { title: 'Romer Niewiadów RK 440', image: 'niewiadow-rk440.webp', description: 'Model pokazany na targach Motor Show w Poznaniu w 2014 roku.', author: 'Travelarz', file: 'Romer_Niewiadów.jpg', license: '3.0' },
];

export default function RestorationModels() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const rotating = !paused && !hovered && !focused;

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setTimeout(() => setIndex(current => (current + 1) % models.length), 5000);
    return () => window.clearTimeout(timer);
  }, [index, rotating]);

  function move(direction) {
    setIndex(current => (current + direction + models.length) % models.length);
  }

  return <section className="restoration-models" aria-labelledby="restoration-models-heading" aria-roledescription="karuzela"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocus={() => setFocused(true)} onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
    }}>
    <div className="models-heading">
      <h3 id="restoration-models-heading">Modele przyczep</h3>
      <div className="models-controls">
        <button type="button" aria-label="Poprzedni model" onClick={() => move(-1)}><ArrowLeft size={19} aria-hidden="true"/></button>
        <span aria-hidden="true">{index + 1} / {models.length}</span>
        <button type="button" aria-label="Następny model" onClick={() => move(1)}><ArrowRight size={19} aria-hidden="true"/></button>
        <button type="button" aria-label={paused ? 'Wznów przewijanie' : 'Wstrzymaj przewijanie'} onClick={() => setPaused(current => !current)}>
          {paused ? <Play size={16} aria-hidden="true"/> : <Pause size={16} aria-hidden="true"/>}
        </button>
      </div>
    </div>
    <div className="models-window" aria-live={rotating ? 'off' : 'polite'}>
      <div className="models-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {models.map(({ title, image, description, author, file, license }, position) => <article key={title} className="model-card" inert={position !== index}>
          <img src={`/media/${image}`} alt={title} loading="lazy" width="1400" height="900"/>
          <div className="model-card-copy">
            <h4>{title}</h4>
            <p>{description}</p>
            <p className="model-credit">Zdjęcie poglądowe · <a href={`https://commons.wikimedia.org/wiki/File:${file}`}>{author}</a> · <a href={`https://creativecommons.org/licenses/by-sa/${license}/`}>CC BY-SA {license}</a> · zmiana formatu i kadrowanie</p>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
