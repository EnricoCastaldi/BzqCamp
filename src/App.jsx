import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import HeroCounters from './components/HeroCounters';
import TrailerPage from './components/TrailerPages';
import { SiteHeader, SiteFooter } from './components/SiteChrome';
import { ArrowUpRight, ChevronDown, Plus, Minus, ShoppingBag, X, Zap } from 'lucide-react';
import VehicleSearch from './components/VehicleSearch';
import Panel from './components/Panel';
import { money, products, vehicles } from './catalog';

import TrailerInquiry from './components/TrailerInquiry';
import RestorationModels from './components/RestorationModels';
import { configuratorUrl, configuratorLabel } from './site-settings';

const cartKey = 'bzq-demo-cart';

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(cartKey));
    return Object.fromEntries(products.filter(({ id }) => Number.isSafeInteger(saved?.[id]) && saved[id] > 0).map(({ id }) => [id, saved[id]]));
  } catch {
    return {};
  }
}

export default function App({ configurator = false, page }) {
  const [cart, setCart] = useState(loadCart);
  const [panel, setPanel] = useState(null);
  const [filter, setFilter] = useState({});
  const [searchReset, setSearchReset] = useState(0);
  useEffect(() => { try { localStorage.setItem(cartKey, JSON.stringify(cart)); } catch { /* In-memory cart still works. */ } }, [cart]);
  const homepage = useRef(null);

  useEffect(() => {
    const main = homepage.current;
    if (!main || !('IntersectionObserver' in window)) return;

    const targets = [...main.querySelectorAll('[data-scroll-reveal]')];
    const observer = new IntersectionObserver(entries => {
      for (const { target, isIntersecting } of entries) {
        target.toggleAttribute('data-offscreen', !isIntersecting);
      }
    });
    targets.forEach(target => observer.observe(target));

    return () => {
      observer.disconnect();
      targets.forEach(target => target.removeAttribute('data-offscreen'));
    };
  }, [filter]);

  const cartItems = products.filter(({ id }) => cart[id]);
  const count = cartItems.reduce((sum, { id }) => sum + cart[id], 0);
  const total = cartItems.reduce((sum, { id, price }) => sum + cart[id] * price, 0);
  const shownProducts = products.filter(({ models }) => filter.model ? models.includes(filter.model) : !filter.brand || vehicles[filter.brand].some(model => models.includes(model)));

  function changeQuantity(id, delta) {
    setCart(current => {
      const next = { ...current };
      const quantity = (current[id] ?? 0) + delta;
      if (quantity > 0) next[id] = quantity;
      else delete next[id];
      return next;
    });
  }

  function search(criteria) {
    setFilter(criteria);
    document.getElementById('produkty').scrollIntoView({ behavior: 'smooth' });
  }

  function add(product) {
    changeQuantity(product.id, 1);
    setPanel({ type: 'cart' });
  }

  const close = () => setPanel(null);
  const shopPanels = <>
    {panel?.type === 'cart' && <Panel title="Twój koszyk" onClose={close} drawer>
      {cartItems.length === 0 ? <p>Koszyk jest pusty.</p> : <>
        <ul className="cart-list">{cartItems.map(product => <li key={product.id}><img src={product.image} alt=""/><div><strong>{product.name}</strong><p>{money.format(product.price * cart[product.id])}</p><div className="quantity"><button className="icon" aria-label={`Zmniejsz ilość: ${product.name}`} onClick={() => changeQuantity(product.id, -1)}><Minus size={16}/></button><span>{cart[product.id]}</span><button className="icon" aria-label={`Zwiększ ilość: ${product.name}`} onClick={() => changeQuantity(product.id, 1)}><Plus size={16}/></button></div></div></li>)}</ul>
        <div className="cart-total"><strong>Razem</strong><strong>{money.format(total)}</strong></div>
        <p>Zamówienia będą dostępne po uruchomieniu sklepu.</p>
      </>}
      <button className="button primary" onClick={close}>Kontynuuj zakupy</button>
    </Panel>}
    {panel?.type === 'account' && <Panel title="Moje konto" onClose={close}><p>Logowanie i historia zamówień będą dostępne po uruchomieniu sklepu.</p><button className="button primary" onClick={close}>Wróć do sklepu</button></Panel>}
  </>;
  const header = <SiteHeader configurator={configurator} page={page} count={count} onPanel={setPanel}/>;

  if (configurator) return <>
    {header}
    {createPortal(<SiteFooter configurator/>, document.getElementById('config-footer'))}
    {shopPanels}
  </>;

  if (page) return <>
    {header}
    <a className="skip" href="#main">Przejdź do treści</a>
    <TrailerPage page={page}/>
    <SiteFooter/>
    {shopPanels}
  </>;

  return <>
    {header}
    <a className="skip" href="#main">Przejdź do treści</a>
    <header className="hero trailer-hero" id="start">
      <div className="hero-copy wrap">
        <p className="eyebrow">Manufaktura przyczep kempingowych</p>
        <h1><span>Przyczepy z historią.</span>{" "}<span>I te, które dopiero ją zaczynają.</span></h1>
        <p className="intro">Ręcznie odnawiamy klasyczne przyczepy kempingowe, w szczególności starsze modele Niewiadów. <span>Budujemy też nowe przyczepy na indywidualne zamówienie.</span></p>
        <div className="hero-actions">
          <a className="button primary trailer-action" href="/renowacje.html">Poznaj renowacje</a>
          <a className="button outline trailer-action" href="#zapytanie">Porozmawiajmy o Twojej przyczepie</a>
        </div>
      </div>
      <HeroCounters/>
      <a className="hero-scroll-cue" href="#realizacje">
        <span>Odkryj renowacje</span>
        <ChevronDown size={18} aria-hidden="true"/>
      </a>
    </header>
    <main id="main" ref={homepage}>
      <section className="section wrap trailer-craft" id="realizacje">
        <div className="section-head" data-scroll-reveal>
          <div><p className="eyebrow">Renowacje</p><h2>Jeszcze wiele dróg przed nią</h2></div>
          <p>Niektóre przyczepy są w rodzinie od czterdziestu lat. Odnawiamy je dla ludzi, którzy chcą dalej z nimi podróżować.</p>
        </div>
        <div className="craft-columns">
          <article data-scroll-reveal><h3>Starsze modele Niewiadów</h3><p>Zakres prac ustalamy po obejrzeniu przyczepy. Bierzemy pod uwagę jej stan i to, które elementy warto zachować.</p></article>
          <article data-scroll-reveal><h3>Praca ręczna, detal po detalu</h3><p>Renowacja często trwa wiele tygodni. Dobieramy materiały i ręcznie dopasowujemy elementy do konkretnej przyczepy.</p></article>
        </div>
        <RestorationModels/>
        <div className="restoration-process">
          <h3 data-scroll-reveal>Jak zaczynamy renowację</h3>
          <ol>
            <li data-scroll-reveal><h4>Zdjęcia i opis</h4><p>Podaj model przyczepy i pokaż miejsca, które wymagają naprawy.</p></li>
            <li data-scroll-reveal><h4>Oględziny w warsztacie</h4><p>Oceniamy stan przyczepy i ustalamy, które oryginalne elementy można zachować.</p></li>
            <li data-scroll-reveal><h4>Zakres i termin</h4><p>Po oględzinach omawiamy materiały, kolejność prac i przewidywany termin.</p></li>
          </ol>
          <a className="button primary" href="/renowacje.html" data-scroll-reveal>Więcej o renowacjach</a>
          <a className="inquiry-link" href="#zapytanie">Wyślij opis i zdjęcia</a>
        </div>
      </section>
      <section className="trailer-build" id="budowa">
        <div className="wrap section trailer-build-copy" data-scroll-reveal>
          <p className="eyebrow">Budowa na zamówienie</p>
          <h2>Przyczepa dopasowana do Twoich podróży</h2>
          <p>Rozmawiamy o tym, jak podróżujesz i czego potrzebujesz na postoju. Na tej podstawie ustalamy układ wnętrza, materiały i wyposażenie nowej przyczepy.</p>
          <a className="button primary" href="/budowa.html#zapytanie">Zapytaj o budowę</a>
        </div>
      </section>
      <div className="section wrap" id="kontakt"><TrailerInquiry source="home"/></div>
      <section className="config-promo wrap" aria-labelledby="config-heading">
        <div className="config-promo-copy" data-scroll-reveal>
          <p className="eyebrow">Instalacje elektryczne</p>
          <h2 id="config-heading">Zaplanuj zasilanie przyczepy</h2>
          <p>Dobierz instalację elektryczną do pojazdu i wyposażenia. Sprawdź szacunkowe zużycie energii i pobierz propozycję w PDF.</p>
          <a className="button primary" href={configuratorUrl} target="_blank" rel="noopener"><Zap size={18} aria-hidden="true"/> {configuratorLabel} <ArrowUpRight size={17} aria-hidden="true"/><span className="sr-only"> (otwiera się w nowej karcie)</span></a>
        </div>
      </section>
      <section className="shop" id="produkty">
        <div className="section wrap">
          <VehicleSearch key={searchReset} onSearch={search}/>
          <div className="section-head" data-scroll-reveal><div><p className="eyebrow">Sklep</p><h2>Nasze produkty</h2></div><p>Katalog demonstracyjny. Zdjęcia, ceny i dopasowanie do modeli mają charakter poglądowy.</p></div>
          {filter.brand && <div className="filter" aria-live="polite"><span>{filter.brand} {filter.model} · {shownProducts.length} wyników</span><button className="text-button" onClick={() => { setFilter({}); setSearchReset(value => value + 1); }}>Wyczyść filtr <X size={16}/></button></div>}
          <div className="product-grid">{shownProducts.map(product => <article className="product" key={product.id} data-scroll-reveal>
            <button className="product-image" aria-label={`Zobacz ${product.name}`} onClick={() => setPanel({ type: 'product', item: product })}><img src={product.image} alt="" loading="lazy"/></button>
            <div className="product-info"><p>{product.category}</p><h3>{product.name}</h3><div className="price"><strong>{money.format(product.price)}</strong><button className="icon product-add" aria-label={`Dodaj do koszyka: ${product.name}`} onClick={() => add(product)}><Plus size={21}/></button></div></div>
          </article>)}</div>
          {shownProducts.length === 0 && <p>W przykładowym katalogu nie ma produktów dla tego modelu.</p>}
        </div>
      </section>
    </main>
    <SiteFooter/>

    {shopPanels}
    {panel?.type === 'product' && <Panel title={panel.item.name} onClose={close}><img className="detail-photo product-detail" src={panel.item.image} alt={panel.item.name}/><p>{panel.item.description}</p><p><strong>{money.format(panel.item.price)}</strong></p><button className="button primary" onClick={() => add(panel.item)}>Dodaj do koszyka</button></Panel>}
  </>;
}
