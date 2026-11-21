import pdfMake from 'pdfmake/build/pdfmake';
import fonts from 'pdfmake/build/vfs_fonts';

pdfMake.addVirtualFileSystem(fonts);

const disclaimer = 'Propozycja wstępna. Parametry i dobór podzespołów wymagają weryfikacji przez instalatora. Cena i termin do ustalenia.';

function section(title) {
  return { text: title, style: 'section' };
}

function table(rows, widths) {
  return {
    table: {
      headerRows: 1,
      widths,
      body: rows.map((row, index) => row.map(text => ({
        text,
        ...(index === 0 && { bold: true, fillColor: '#eef3d8' }),
      }))),
    },
    layout: 'lightHorizontalLines',
  };
}

async function imageData(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error("Cannot load PDF image: " + path);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function downloadProposal({ contact, options, equipment, tables, totals, warnings }) {
  const date = new Intl.DateTimeFormat('pl-PL', { dateStyle: 'long' }).format();
  const [logo, camper] = await Promise.all([
    imageData('/media/logo.png'),
    imageData('/media/camper-proposal.jpg'),
  ]);
  const document = {
    info: { title: 'Wstępna propozycja instalacji elektrycznej', author: 'BZQ Camp' },
    pageSize: 'A4',
    pageMargins: [38, 36, 38, 42],
    defaultStyle: { fontSize: 9, color: '#22251d', lineHeight: 1.15 },
    styles: { section: { fontSize: 13, bold: true, margin: [0, 15, 0, 5] } },
    footer: (page, count) => ({
      text: `BZQ Camp  /  ${page} z ${count}`,
      alignment: 'right', margin: [38, 10, 38, 0], color: '#565b4e',
    }),
    content: [
      {
        table: { widths: [66, '*'], body: [[
          { image: logo, width: 52, fillColor: '#171a12', margin: [5, 6, 0, 5] },
          { stack: [
            { text: 'Wstępna propozycja instalacji elektrycznej', fontSize: 18, bold: true, color: '#ffffff' },
            { text: date, color: '#e5ef97', margin: [0, 5, 0, 0] },
          ], fillColor: '#171a12', margin: [5, 6, 5, 5] },
        ]] },
        layout: 'noBorders',
      },
      { text: disclaimer, margin: [0, 10, 0, 0], color: '#565b4e' },
      { image: camper, fit: [460, 155], alignment: 'center', margin: [0, 12, 0, 8] },
      {
        table: { widths: ['*', '*', '*'], body: [totals.map(({ label, value }) => ({
          stack: [
            { text: value, fontSize: 20, bold: true },
            { text: label, color: '#565b4e' },
          ],
          margin: [9, 8, 6, 8],
          fillColor: '#eef3d8',
        }))] },
        layout: 'noBorders',
      },
      section('Dane kontaktowe'),
      table([['Pole', 'Wartość'], ['Imię', contact.name || '—'], ['E-mail', contact.mail || '—'],
        ['Telefon', contact.tel || '—'], ['Uwagi', contact.msg || '—']], [125, '*']),
      section('Założenia konfiguracji'),
      table([['Parametr', 'Wartość'], ...options], [165, '*']),
      section('Wybrane urządzenia'),
      equipment.length
        ? table([['Urządzenie', 'Zasilanie', 'Moc', 'Czas/dobę', 'Szt.'], ...equipment], ['*', 52, 48, 62, 27])
        : { text: 'Brak wybranych urządzeń.' },
      section('Dobór podzespołów'),
      table(tables[0], [58, '*', 125, 35]),
      section('Kable i zabezpieczenia'),
      table(tables[1], ['*', 54, 65, 110]),
      ...(warnings.length ? [section('Uwagi do konfiguracji'), { ul: warnings }] : []),
    ],
  };
  await new Promise(resolve => {
    pdfMake.createPdf(document).download('BZQ-Camp-propozycja-instalacji.pdf', resolve);
  });
}
