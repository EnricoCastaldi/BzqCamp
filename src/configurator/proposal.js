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
        ...(index === 0 && { bold: true, fillColor: '#f0e5d1' }),
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

export async function downloadProposal({ contact, options, equipment, tables, totals, proposalImage, warnings, locale, translate: t }) {
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format();
  const [logo, vehicleImage] = await Promise.all([
    imageData('/media/logo.png'),
    imageData(proposalImage),
  ]);
  const document = {
    info: { title: t('Wstępna propozycja instalacji elektrycznej'), author: 'BZQ Camp' },
    pageSize: 'A4',
    pageMargins: [38, 36, 38, 42],
    defaultStyle: { fontSize: 9, color: '#24211d', lineHeight: 1.15 },
    styles: { section: { fontSize: 13, bold: true, margin: [0, 15, 0, 5] } },
    footer: (page, count) => ({
      text: `BZQ Camp  /  ${t('{0} z {1}', page, count)}`,
      alignment: 'right', margin: [38, 10, 38, 0], color: '#625a4f',
    }),
    content: [
      {
        table: { widths: [66, '*'], body: [[
          { image: logo, width: 52, fillColor: '#1d1b19', margin: [5, 6, 0, 5] },
          { stack: [
            { text: t('Wstępna propozycja instalacji elektrycznej'), fontSize: 18, bold: true, color: '#ffffff' },
            { text: date, color: '#ddc69b', margin: [0, 5, 0, 0] },
          ], fillColor: '#1d1b19', margin: [5, 6, 5, 5] },
        ]] },
        layout: 'noBorders',
      },
      { text: t(disclaimer), margin: [0, 10, 0, 0], color: '#625a4f' },
      { image: vehicleImage, fit: [460, 155], alignment: 'center', margin: [0, 12, 0, 8] },
      {
        table: { widths: ['*', '*', '*'], body: [totals.map(({ label, value }) => ({
          stack: [
            { text: value, fontSize: 20, bold: true },
            { text: t(label), color: '#625a4f' },
          ],
          margin: [9, 8, 6, 8],
          fillColor: '#f0e5d1',
        }))] },
        layout: 'noBorders',
      },
      section(t('Dane kontaktowe')),
      table([[t('Pole'), t('Wartość')], [t('Imię'), contact.name || '—'], ['E-mail', contact.mail || '—'],
        [t('Telefon'), contact.tel || '—'], [t('Uwagi'), contact.msg || '—']], [125, '*']),
      section(t('Założenia konfiguracji')),
      table([[t('Parametr'), t('Wartość')], ...options], [165, '*']),
      section(t('Wybrane urządzenia')),
      equipment.length
        ? table([[t('Urządzenie'), t('Zasilanie'), t('Moc'), t('Czas/dobę'), t('Szt.')], ...equipment], ['*', 52, 48, 62, 27])
        : { text: t('Brak wybranych urządzeń.') },
      section(t('Dobór podzespołów')),
      table(tables[0], [58, '*', 125, 35]),
      section(t('Kable i zabezpieczenia')),
      table(tables[1], ['*', 54, 65, 110]),
      ...(warnings.length ? [section(t('Uwagi do konfiguracji')), { ul: warnings }] : []),
    ],
  };
  await new Promise(resolve => {
    pdfMake.createPdf(document).download('BZQ-Camp-propozycja-instalacji.pdf', resolve);
  });
}
