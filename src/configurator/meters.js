const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const integers = new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 0 });
const decimals = new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 1 });
const meters = [...document.querySelectorAll('[data-meter]')].map(element => ({
  element,
  key: element.dataset.meter,
  value: 0,
  target: undefined,
  frame: null,
}));

function format(key, value) {
  if (key === 'summer' || key === 'winter') {
    return value >= 30 ? '30+' : decimals.format(value);
  }
  return integers.format(value);
}

function draw(meter, value) {
  meter.value = value;
  meter.element.textContent = format(meter.key, value);
}

export function updateMeters(values) {
  for (const meter of meters) {
    const value = values[meter.key];
    const target = Number.isFinite(value) ? value : 0;
    if (target === meter.target) continue;
    cancelAnimationFrame(meter.frame);
    meter.target = target;

    if (motion.matches) {
      draw(meter, target);
      continue;
    }

    const from = meter.value;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min(1, (now - start) / 550);
      const eased = 1 - (1 - progress) ** 3;
      draw(meter, progress === 1 ? target : from + (target - from) * eased);
      if (progress < 1) meter.frame = requestAnimationFrame(tick);
    }
    draw(meter, from);
    meter.frame = requestAnimationFrame(tick);
  }
}

motion.addEventListener('change', event => {
  if (!event.matches) return;
  for (const meter of meters) {
    cancelAnimationFrame(meter.frame);
    if (meter.target !== undefined) draw(meter, meter.target);
  }
});
