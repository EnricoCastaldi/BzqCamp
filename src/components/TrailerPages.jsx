import React from 'react';

import TrailerInquiry from './TrailerInquiry';
import RestorationModels from './RestorationModels';
import TrailerPhotos from './TrailerPhotos';

const pages = {
  renowacje: {
    title: 'Renowacje przyczep kempingowych',
    intro: 'Ręcznie odnawiamy klasyczne przyczepy, w tym starsze modele Niewiadów. Zakres prac dopasowujemy do stanu przyczepy i tego, co chcesz w niej zachować.',
    sections: [
      ['Ocena przyczepy', 'Zaczynamy od oględzin. Ustalamy, które elementy można zachować, co wymaga naprawy i jakie materiały pasują do wnętrza.'],
      ['Prace w warsztacie', 'Dopasowujemy elementy ręcznie. Renowacja może potrwać kilka tygodni, zależnie od stanu przyczepy i zakresu prac.'],
      ['Co przygotować', 'Podaj model przyczepy i prześlij zdjęcia z zewnątrz, wnętrza oraz miejsc, które wymagają naprawy.'],
    ],
    cta: 'Porozmawiajmy o renowacji',
  },
  budowa: {
    title: 'Budowa przyczep na zamówienie',
    intro: 'Budujemy przyczepy ręcznie. Rozmowa o tym, gdzie i jak podróżujesz, pomaga dobrać układ, materiały i wyposażenie.',
    sections: [
      ['Układ wnętrza', 'Ustalamy liczbę miejsc do spania, miejsce na bagaż i sposób korzystania z wnętrza podczas postoju.'],
      ['Materiały i wyposażenie', 'Omawiamy wykończenie, tkaniny i wyposażenie. Dobieramy je do sposobu użytkowania i zakresu zamówienia.'],
      ['Zakres i termin', 'Po uzgodnieniu projektu możemy omówić koszt i termin realizacji.'],
    ],
    cta: 'Zapytaj o budowę',
  },
  kontakt: {
    title: 'Opowiedz nam o swojej przyczepie',
    intro: 'Chcesz odnowić starszą przyczepę lub zamówić nową? Przygotuj kilka informacji, które pomogą nam omówić zakres prac.',
    sections: [
      ['Renowacja', 'Podaj model, stan przyczepy i zakres planowanych prac. Przygotuj zdjęcia z zewnątrz i ze środka.'],
      ['Budowa na zamówienie', 'Napisz, ile osób będzie podróżować, jakiego wyposażenia potrzebujesz i kiedy chcesz rozpocząć projekt.'],
    ],
    cta: 'Wyślij opis i zdjęcia',
  },
};

export default function TrailerPage({ page }) {
  const { title, intro, sections, cta } = pages[page];
  return <main className={`trailer-page trailer-page-${page}`} id="main">
    <div className="trailer-page-banner">
      <div className="wrap">
        <h1>{title}</h1>
        <p>{intro}</p>
        <a className="button primary" href="#zapytanie">{cta}</a>
      </div>
    </div>
    <div className="section wrap">
      <div className="trailer-page-details">
        {sections.map(([heading, copy]) => <section key={heading}>
          <h2>{heading}</h2><p>{copy}</p>
        </section>)}
      </div>
      <TrailerInquiry source={page}/>
      {page === 'renowacje' ? <RestorationModels/> : <TrailerPhotos/>}
    </div>
  </main>;
}
