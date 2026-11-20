import React, { useEffect, useState } from 'react';
import { Menu, Plus, Minus, ShoppingBag, UserRound, X, Mountain } from 'lucide-react';
import VehicleSearch from './components/VehicleSearch';
import Panel from './components/Panel';
import HeroGallery from './components/HeroGallery';
import BrandCarousel from './components/BrandCarousel';
import { money, products, projects, vehicles } from './catalog';

const links = [['start', 'Strona główna'], ['realizacje', 'Nasze realizacje'], ['produkty', 'Nasze produkty']];
const cartKey = 'bzq-demo-cart';

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(cartKey));
    return Object.fromEntries(products.filter(({ id }) => Number.isSafeInteger(saved?.[id]) && saved[id] > 0).map(({ id }) => [id, saved[id]]));
  } catch {
    return {};
  }
}

export default function App() {
  const [cart, setCart] = useState(loadCart);
  const [panel, setPanel] = useState(null);
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState({});
  const [searchReset, setSearchReset] = useState(0);
  useEffect(() => { try { localStorage.setItem(cartKey, JSON.stringify(cart)); } catch { /* In-memory cart still works. */ } }, [cart]);
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
  return <>
    <a className="skip" href="#main">Przejdź do treści</a>
    <header className="hero" id="start">
      <HeroGallery/>
      <nav className="nav wrap" aria-label="Menu główne">
        <a className="brand" href="#start" aria-label="BZQ Camp — strona główna"><img src="/media/logo.png" alt="BZQ Camp" width="68" height="49"/></a>
        <button className="icon menu-toggle" type="button" aria-label={menu ? 'Zamknij menu' : 'Otwórz menu'} aria-controls="nav-links" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
        <div className={menu ? 'nav-links open' : 'nav-links'} id="nav-links">{links.map(([id, label]) => <a key={id} href={'#' + id} onClick={() => setMenu(false)}>{label}</a>)}</div>
        <div className="nav-actions">
          <button className="icon" aria-label="Moje konto" onClick={() => setPanel({ type: 'account' })}><UserRound size={21}/></button>
          <button className="icon bag" aria-label={`Koszyk, ${count} szt.`} onClick={() => setPanel({ type: 'cart' })}><ShoppingBag size={21}/>{count > 0 && <span>{count}</span>}</button>
        </div>
      </nav>
      <div className="hero-copy wrap">
        <p className="eyebrow">Zabudowy kamperów & części</p>
        <h1>Twój van.<br/>Twój kierunek.</h1>
        <p className="intro">Odkryj możliwości zabudowy kampera i dobierz części do swojego vana.</p>
        <div className="hero-actions"><a className="button primary" href="#realizacje">Poznaj realizacje<span className="button-icon"><Mountain size={19} aria-hidden="true"/></span></a><a className="button outline" href="#produkty">Przejdź do sklepu<span className="button-icon"><ShoppingBag size={18} aria-hidden="true"/></span></a></div>
      </div>
    </header>
    <main id="main">
      <div className="wrap finder-wrap"><VehicleSearch key={searchReset} onSearch={search}/></div>
      <BrandCarousel/>
      <section className="section wrap" id="realizacje">
        <div className="section-head"><div><p className="eyebrow">Zabudowy</p><h2>Nasze realizacje</h2></div><p>Poznaj przykładowe kierunki zabudowy vana, od wnętrza po wersję wyprawową.</p></div>
        <div className="projects">{projects.map(project => <button className="project" key={project.name} onClick={() => setPanel({ type: 'project', item: project })}><img src={project.image} alt="" loading="lazy"/><div><span>{project.tag}</span><h3>{project.name}</h3></div><span className="project-plus" aria-hidden="true"><Plus size={21}/></span></button>)}</div>
      </section>
      <section className="shop" id="produkty">
        <div className="section wrap">
          <div className="section-head"><div><p className="eyebrow">Sklep</p><h2>Nasze produkty</h2></div><p>Katalog demonstracyjny. Zdjęcia, ceny i dopasowanie do modeli mają charakter poglądowy.</p></div>
          {filter.brand && <div className="filter" aria-live="polite"><span>{filter.brand} {filter.model} · {shownProducts.length} wyników</span><button className="text-button" onClick={() => { setFilter({}); setSearchReset(value => value + 1); }}>Wyczyść filtr <X size={16}/></button></div>}
          <div className="product-grid">{shownProducts.map(product => <article className="product" key={product.id}>
            <button className="product-image" aria-label={`Zobacz ${product.name}`} onClick={() => setPanel({ type: 'product', item: product })}><img src={product.image} alt="" loading="lazy"/></button>
            <div className="product-info"><p>{product.category}</p><h3>{product.name}</h3><div className="price"><strong>{money.format(product.price)}</strong><button className="icon product-add" aria-label={`Dodaj do koszyka: ${product.name}`} onClick={() => add(product)}><Plus size={21}/></button></div></div>
          </article>)}</div>
          {shownProducts.length === 0 && <p>W przykładowym katalogu nie ma produktów dla tego modelu.</p>}
        </div>
      </section>
    </main>
    <footer><div className="wrap footer-inner"><a href="#start" aria-label="BZQ Camp — wróć na górę"><img src="/media/logo.png" alt="BZQ Camp"/></a><div>{links.map(([id, label]) => <a key={id} href={'#' + id}>{label}</a>)}</div></div></footer>

    {panel?.type === 'cart' && <Panel title="Twój koszyk" onClose={close} drawer>
      {cartItems.length === 0 ? <p>Koszyk jest pusty.</p> : <>
        <ul className="cart-list">{cartItems.map(product => <li key={product.id}><img src={product.image} alt=""/><div><strong>{product.name}</strong><p>{money.format(product.price * cart[product.id])}</p><div className="quantity"><button className="icon" aria-label={`Zmniejsz ilość: ${product.name}`} onClick={() => changeQuantity(product.id, -1)}><Minus size={16}/></button><span>{cart[product.id]}</span><button className="icon" aria-label={`Zwiększ ilość: ${product.name}`} onClick={() => changeQuantity(product.id, 1)}><Plus size={16}/></button></div></div></li>)}</ul>
        <div className="cart-total"><strong>Razem</strong><strong>{money.format(total)}</strong></div>
        <p>Zamówienia będą dostępne po uruchomieniu sklepu.</p>
      </>}
      <button className="button primary" onClick={close}>Kontynuuj zakupy</button>
    </Panel>}
    {panel?.type === 'account' && <Panel title="Moje konto" onClose={close}><p>Logowanie i historia zamówień będą dostępne po uruchomieniu sklepu.</p><button className="button primary" onClick={close}>Wróć do sklepu</button></Panel>}
    {panel?.type === 'project' && <Panel title={panel.item.name} onClose={close}><img className="detail-photo" src={panel.item.image} alt={panel.item.name}/><p>{panel.item.description}</p></Panel>}
    {panel?.type === 'product' && <Panel title={panel.item.name} onClose={close}><img className="detail-photo product-detail" src={panel.item.image} alt={panel.item.name}/><p>{panel.item.description}</p><p><strong>{money.format(panel.item.price)}</strong></p><button className="button primary" onClick={() => add(panel.item)}>Dodaj do koszyka</button></Panel>}
  </>;
}
