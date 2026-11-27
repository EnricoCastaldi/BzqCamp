import rows from './translations.js';

const messages = new Map(rows.map(([pl, en, de]) => [pl, { en, de }]));
const languages = { pl: 'pl-PL', en: 'en-GB', de: 'de-DE' };
const params = new URLSearchParams(location.search);
const supported = code => Object.hasOwn(languages, code);
let saved;
try { saved = localStorage.getItem('bzq-config-language'); } catch { /* Storage is optional. */ }
export let language = [params.get('lang'), saved, 'pl'].find(supported);
export let locale = languages[language];

export function setLanguage(code) {
  if (!supported(code)) return;
  language = code;
  locale = languages[code];
  document.documentElement.lang = code;
  try { localStorage.setItem('bzq-config-language', code); } catch { /* Storage is optional. */ }
  const url = new URL(location.href);
  url.searchParams.set('lang', code);
  history.replaceState(history.state, '', url);
}

export function translator(code) {
  return (source, ...values) => (messages.get(source)?.[code] ?? source).replace(/\{(\d+)\}/g, (token, index) => values[index] ?? token);
}

export function t(source, ...values) {
  return translator(language)(source, ...values);
}

const originals = new WeakMap();

// Translate static text and labels in the original HTML and in generated views.
export function localize(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement.closest('input, textarea, select, script, style, [data-live-translation]')) continue;
    if (!originals.has(node)) originals.set(node, node.data);
    const original = originals.get(node);
    const phrase = original.trim();
    if (messages.has(phrase)) node.data = original.replace(phrase, () => t(phrase));
  }
  for (const element of root.querySelectorAll('[aria-label], img[alt]')) {
    if (element.id === 'diagram' || element.id === 'vehicle-preview') continue;
    if (!originals.has(element)) originals.set(element, [element.getAttribute('aria-label'), element.getAttribute('alt')]);
    const [label, alt] = originals.get(element);
    if (label && messages.has(label)) element.setAttribute('aria-label', t(label));
    if (alt && messages.has(alt)) element.setAttribute('alt', t(alt));
  }
}
