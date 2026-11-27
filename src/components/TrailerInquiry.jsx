import React, { useState } from 'react';
import { ArrowUpRight, Camera, ImagePlus, Mail, Wrench } from 'lucide-react';

const endpoint = import.meta.env.VITE_INQUIRY_ENDPOINT;
const privacyUrl = import.meta.env.VITE_PRIVACY_URL;
const enabled = Boolean(endpoint && privacyUrl);
const types = ['image/jpeg', 'image/png', 'image/webp'];

export default function TrailerInquiry({ source }) {
  const [photos, setPhotos] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState('');
  async function submit(event) {
    event.preventDefault();
    if (!enabled || status === 'sending') return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const photos = data.getAll('photos').filter(file => file.size);
    if (photos.length > 5 || photos.some(file => !types.includes(file.type) || file.size > 5 * 1024 * 1024)) {
      setStatus('Wybierz do 5 zdjęć JPEG, PNG lub WebP, maksymalnie 5 MB każde.');
      return;
    }
    setStatus('sending');
    try {
      const response = await fetch(endpoint, { method: 'POST', body: data });
      if (!response.ok || !(await response.json()).id) throw new Error('Submission failed');
      form.reset();
      setPhotos([]);
      setStatus('Dziękujemy. Otrzymaliśmy Twoje zgłoszenie.');
    } catch {
      setStatus('Nie udało się wysłać zgłoszenia. Twoje dane są nadal w formularzu. Spróbuj ponownie.');
    }
  }

  return <section className="trailer-inquiry" id="zapytanie" aria-labelledby="inquiry-title">
    <div className="inquiry-intro"><span className="inquiry-emblem"><Wrench size={24} aria-hidden="true"/></span><p className="eyebrow">Zapytanie do warsztatu</p><h2 id="inquiry-title">Opowiedz nam o swojej przyczepie</h2><p>Podaj model, opisz potrzebne prace i pokaż, co wymaga naprawy.</p></div>
    <form onSubmit={submit}>
      <input type="hidden" name="source" value={source}/>
      <div className="inquiry-fields">
        <label><span>Model i rocznik</span><input name="trailer" placeholder="np. Niewiadów N126, 1985" required maxLength={150}/></label>
        <label><span>Twój e-mail</span><input placeholder="np. anna@example.com" name="email" type="email" autoComplete="email" required maxLength={254}/></label>
      </div>
      <label>Co chcesz naprawić lub zmienić?<textarea name="description" placeholder="Opisz stan przyczepy i prace, których potrzebujesz." rows={4} required maxLength={3000}/></label>
      <div className="inquiry-upload-group">
        <p><Camera size={17} aria-hidden="true"/> Zdjęcia przyczepy <span>(opcjonalnie)</span></p>
        <label className={dragging ? 'inquiry-upload dragging' : 'inquiry-upload'}
          onDragOver={event => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={event => {
            event.preventDefault();
            setDragging(false);
            if (!event.dataTransfer.files.length) return;
            event.currentTarget.querySelector('input').files = event.dataTransfer.files;
            setPhotos(Array.from(event.dataTransfer.files));
          }}>
          <input name="photos" type="file" accept={types.join(',')} multiple onChange={event => setPhotos(Array.from(event.target.files))}/>
          <ImagePlus size={23} aria-hidden="true"/>
          <span><strong>Wybierz lub upuść zdjęcia</strong><small>Do 5 plików JPEG, PNG lub WebP · maks. 5 MB każdy</small></span>
        </label>
        {photos.length > 0 && <ul className="inquiry-files" aria-label="Wybrane zdjęcia">{photos.map((file, index) => <li key={index}>{file.name}</li>)}</ul>}
      </div>
      <label className="inquiry-consent"><input name="marketing" type="checkbox" value="email-v1"/><span>Chcę otrzymywać e-mailem oferty i aktualności BZQ Camp. Zgodę mogę wycofać w każdej chwili.</span></label>
      {privacyUrl && <a className="inquiry-privacy" href={privacyUrl}>Informacje o przetwarzaniu danych</a>}
      {!enabled && <p className="inquiry-note"><Mail size={15} aria-hidden="true"/> Wysyłka będzie dostępna po uruchomieniu formularza.</p>}
      <button className="button primary" disabled={!enabled || status === 'sending'}>Wyślij zapytanie <ArrowUpRight size={17} aria-hidden="true"/></button>
      <p role="status">{status === 'sending' ? 'Wysyłamy zgłoszenie…' : status}</p>
    </form>
  </section>;
}
