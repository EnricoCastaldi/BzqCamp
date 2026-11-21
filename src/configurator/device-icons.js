const television = '<rect x="3" y="5" width="18" height="13" rx="2"/><path d="M8 22h8m-4-4v4"/>';
const icons = {
  led: '<path d="M9 18h6m-5 4h4m-2-20a6 6 0 0 0-4 10.5c1 1 1 2 1 3.5h6c0-1.5 0-2.5 1-3.5A6 6 0 0 0 12 2z"/>',
  usb: '<path d="M12 21V3l-2 2m2-2 2 2M12 16l-5-4v-3m5 5 5-4V7"/><circle cx="7" cy="8" r="1"/><rect x="16" y="5" width="2" height="2"/>',
  fridge: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M5 10h14m-10-4v1m0 7v3"/>',
  fan: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 10c-4-6 4-8 3-2l-1 3m0 2c7-1 5 7 0 4l-2-3m-2-1c-3 6-9 0-4-2l4 1"/>',
  pump: '<path d="M12 2C10 6 5 10 5 15a7 7 0 0 0 14 0c0-5-5-9-7-13Z M8 15a4 4 0 0 0 4 4"/>',
  heater: '<path d="M12 2c3 6 8 8 8 13a8 8 0 0 1-16 0c0-4 2-6 5-9 0 4 2 5 2 5 2-3 2-6 1-9Z"/>',
  laptop: '<rect x="4" y="4" width="16" height="12" rx="2"/><path d="m4 16-2 4h20l-2-4m-10-7h4"/>',
  speaker: '<rect x="6" y="2" width="12" height="20" rx="2"/><circle cx="12" cy="15" r="3"/><path d="M12 7h.01"/>',
  tv12: television,
  tv230: television,
  starlink: '<path d="M4 5a12 12 0 0 0 15 15L4 5Zm5 10-4 6m5 0H3m11-10 3-3m0-4a6 6 0 0 1 4 4"/><circle cx="17" cy="8" r="1"/>',
  console: '<path d="M7 8h10c3 0 4 4 5 8 .5 2-2 4-4 2l-2-2H8l-2 2c-2 2-4.5 0-4-2 1-4 2-8 5-8Zm1 2v4m-2-2h4m6-1h.01m3 2h.01"/>',
  kettle: '<path d="M7 7h10l2 13H5L7 7Zm2 0V4h6v3m2 2h3a2 2 0 0 1 2 2v4h-4M7 9 2 7l4 7"/>',
  micro: '<rect x="2" y="5" width="20" height="14" rx="2"/><rect x="5" y="8" width="10" height="8" rx="1"/><path d="M18 9h1m-1 4h1"/>',
  toaster: '<path d="M2 12a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v6H2zM7 5h10m-3 8h4m0-2v4M5 18v2m14-2v2"/>',
  induction: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2.5"/><circle cx="15" cy="15" r="3"/><path d="M6 17h1"/>',
  coffee: '<path d="M5 21h15M6 21V4h12v5H9m4 0v3m-3 2h7v3a3 3 0 0 1-3 3h-1a3 3 0 0 1-3-3zM17 15h2v2h-2"/>',
  airfryer: '<rect x="5" y="3" width="14" height="18" rx="4"/><path d="M5 12h14m-7 3v3"/><circle cx="12" cy="8" r="1.5"/>',
  dryer: '<path d="M3 7h12a4 4 0 0 1 0 8h-3l1 5h-3l-2-5H3zM3 7v8m5-6v4"/>',
  ebike: '<circle cx="5" cy="17" r="4"/><circle cx="19" cy="17" r="4"/><path d="m5 17 4-7 4 7H5m8 0 3-10h3M7 10h4"/>',
  ac: '<rect x="2" y="4" width="20" height="10" rx="2"/><path d="M5 10h14m-13 7v3m6-3v4m6-4v3"/>',
  straight: '<path d="m4 19 14-9 2 3-15 9zm0 0L14 3l3 2-7 10m-6 4-2 3"/>',
};

export function deviceIcon(id) {
  return `<span class="device-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${icons[id] ?? ''}</svg></span>`;
}
