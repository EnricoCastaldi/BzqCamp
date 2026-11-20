import React from "react";
import { CarFront, ChevronDown, Search } from 'lucide-react';
import { useState } from 'react';
import { vehicles } from '../catalog';

export default function VehicleSearch({ onSearch }) {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  return <form className="finder" onSubmit={event => { event.preventDefault(); onSearch({ brand, model }); }}>
    <div className="finder-title"><CarFront size={23}/><div><strong>Znajdź części do swojego vana</strong><small>Dobierz wyposażenie według modelu</small></div></div>
    <label className="select"><span>Marka</span><select value={brand} onChange={event => { setBrand(event.target.value); setModel(''); }}><option value="">Wszystkie marki</option>{Object.keys(vehicles).map(name => <option key={name}>{name}</option>)}</select><ChevronDown size={15}/></label>
    <label className="select"><span>Model</span><select value={model} disabled={!brand} onChange={event => setModel(event.target.value)}><option value="">Wszystkie modele</option>{vehicles[brand]?.map(name => <option key={name}>{name}</option>)}</select><ChevronDown size={15}/></label>
    <button className="button primary"><Search size={17}/> Szukaj części</button>
  </form>;
}
