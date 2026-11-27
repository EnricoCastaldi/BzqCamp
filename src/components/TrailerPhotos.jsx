import React from 'react';

const photos = [
  { image: '/media/trailer-contact-lakeside.webp', label: 'Klasyczna przyczepa nad jeziorem' },
  { image: '/media/niewiadow-n126.webp', label: 'Niewiadów N126 obok Polskiego Fiata', credit: 'Michał Derela', file: 'Niewiadów_N126_trailer_164256.jpg', license: '4.0' },
];

export default function TrailerPhotos() {
  return <div className="trailer-gallery">
    {photos.map(({ image, label, credit, file, license }) => <figure key={image}>
      <img src={image} alt={label} loading="lazy"/>
      <figcaption>{label} {file ? <>· <a href={`https://commons.wikimedia.org/wiki/File:${file}`}>{credit}, Wikimedia Commons</a> · <a href={`https://creativecommons.org/licenses/by-sa/${license}/`}>CC BY-SA {license}</a> · zmiana formatu i kadrowanie na stronie</> : <span>· zdjęcie poglądowe</span>}</figcaption>
    </figure>)}
  </div>;
}
