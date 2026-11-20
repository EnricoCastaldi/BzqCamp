import React, { useState } from 'react';
import { Pause, Play } from 'lucide-react';

const brands = [
  { name: 'HYMER', id: 'hymer' },
  { name: 'Carthago', id: 'carthago' },
  { name: 'Concorde', id: 'concorde' },
  { name: 'MORELO', id: 'morelo' },
  { name: 'Niesmann + Bischoff', id: 'niesmann-bischoff' },
];

function BrandLogo({ brand }) {
  const [unavailable, setUnavailable] = useState(false);
  return unavailable
    ? <span>{brand.name}</span>
    : <img src={`/media/brands/${brand.id}.webp`} alt={brand.name} onError={() => setUnavailable(true)}/>;
}

export default function BrandCarousel() {
  const [paused, setPaused] = useState(false);

  return <section className="brand-section wrap" aria-labelledby="brand-heading">
    <div className="brand-header">
      <h2 id="brand-heading">Producenci kamperów premium</h2>
      <button type="button" className="icon brand-pause" aria-label={paused ? 'Wznów animację marek' : 'Wstrzymaj animację marek'} onClick={() => setPaused(value => !value)}>{paused ? <Play size={16}/> : <Pause size={16}/>}</button>
    </div>
    <div className="brand-viewport">
      <div className={paused ? 'brand-track paused' : 'brand-track'}>
        {[false, true].map(duplicate => <ul className={duplicate ? 'brand-row brand-repeat' : 'brand-row'} aria-hidden={duplicate || undefined} key={String(duplicate)}>
          {brands.map(brand => <li className="brand-tile" key={brand.id}><BrandLogo brand={brand}/></li>)}
        </ul>)}
      </div>
    </div>
  </section>;
}
