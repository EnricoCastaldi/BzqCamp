import '../styles.css';
import './main';

const storefront = import.meta.env.VITE_STOREFRONT_URL || '/';
document.querySelectorAll('[data-storefront]').forEach(link => { link.href = storefront; });
