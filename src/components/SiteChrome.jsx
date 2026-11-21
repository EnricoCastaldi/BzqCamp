import React, { useEffect, useState } from 'react';
import { Menu, ShoppingBag, UserRound, X } from 'lucide-react';

const links = [['start', 'Strona główna'], ['realizacje', 'Nasze realizacje'], ['produkty', 'Nasze produkty'], ['/konfigurator.html', 'Konfigurator']];

function siteHref(id, configurator) {
  return id.startsWith('/') ? id : (configurator ? '/' : '') + '#' + id;
}

export function SiteHeader({ configurator, count, onPanel }) {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 24);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return <header className={configurator || scrolled ? 'site-header solid' : 'site-header'}>
    <nav className="nav wrap" aria-label="Menu główne">
        <a className="brand" href={siteHref("start", configurator)} aria-label="BZQ Camp — strona główna"><img src="/media/logo.png" alt="BZQ Camp" width="68" height="49"/></a>
        <button className="icon menu-toggle" type="button" aria-label={menu ? 'Zamknij menu' : 'Otwórz menu'} aria-controls="nav-links" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
        <div className={menu ? 'nav-links open' : 'nav-links'} id="nav-links">{links.map(([id, label]) => <a key={id} href={siteHref(id, configurator)} aria-current={configurator && id === "/konfigurator.html" ? "page" : undefined} onClick={() => setMenu(false)}>{label}</a>)}</div>
        <div className="nav-actions">
          <button className="icon" aria-label="Moje konto" onClick={() => onPanel({ type: 'account' })}><UserRound size={21}/></button>
          <button className="icon bag" aria-label={`Koszyk, ${count} szt.`} onClick={() => onPanel({ type: 'cart' })}><ShoppingBag size={21}/>{count > 0 && <span>{count}</span>}</button>
        </div>
      </nav>
  </header>;
}

export function SiteFooter({ configurator }) {
  return <footer><div className="wrap footer-inner"><a href={siteHref("start", configurator)} aria-label="BZQ Camp — strona główna"><img src="/media/logo.png" alt="BZQ Camp"/></a><div>{links.map(([id, label]) => <a key={id} href={siteHref(id, configurator)}>{label}</a>)}</div></div></footer>;
}
