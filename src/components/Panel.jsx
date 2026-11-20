import React from "react";
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Panel({ title, children, onClose, drawer }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return <dialog ref={ref} className={drawer ? 'dialog drawer' : 'dialog'} aria-labelledby="dialog-title" onCancel={onClose} onClick={event => { if (event.target === ref.current) onClose(); }}>
    <div className="dialog-content">
      <div className="dialog-heading"><h2 id="dialog-title">{title}</h2><button type="button" className="icon" aria-label="Zamknij" onClick={onClose}><X size={23}/></button></div>
      {children}
    </div>
  </dialog>;
}
