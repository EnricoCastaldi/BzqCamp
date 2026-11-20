// Replace the sample catalog with API data when the Node service is ready.
export const vehicles = {
  Fiat: ['Ducato'],
  Ford: ['Transit', 'Transit Custom'],
  Mercedes: ['Sprinter', 'Vito'],
  Volkswagen: ['Crafter', 'Transporter'],
  Peugeot: ['Boxer'],
};
const allModels = Object.values(vehicles).flat();
export const products = [
  { id: 'window', name: 'Okno boczne przyciemniane', category: 'Okna i wentylacja', price: 899, models: ['Ducato','Boxer','Transit','Sprinter','Crafter'], image: '/media/window.webp', description: 'Przykładowe okno boczne z przyciemnianą szybą do projektu zabudowy.' },
  { id: 'vent', name: 'Okno dachowe 40 × 40', category: 'Okna i wentylacja', price: 649, models: allModels, image: '/media/vent.webp', description: 'Przykładowe okno dachowe z uchylną pokrywą do strefy mieszkalnej.' },
  { id: 'step', name: 'Stopień wejściowy', category: 'Nadwozie i dostęp', price: 1199, models: ['Ducato','Boxer','Sprinter','Transit','Crafter'], image: '/media/step.webp', description: 'Przykładowy stopień wejściowy do zabudowy kamperowej.' },
];
export const projects = [
  { name: 'Zabudowa od podstaw', tag: 'Koncepcja wnętrza', image: '/media/interior.webp', description: 'Układ z łóżkiem i pojemnymi schowkami. Ciepłe drewno i jasne tkaniny nadają wnętrzu spokojny charakter.' },
  { name: 'Kamper wyprawowy', tag: 'Koncepcja nadwozia', image: '/media/hero.webp', description: 'Inspiracja dla zabudowy na dłuższe trasy. Grafitowe nadwozie, wysoki dach i miejsce na wyposażenie wyprawowe.' },
];
export const money = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });
