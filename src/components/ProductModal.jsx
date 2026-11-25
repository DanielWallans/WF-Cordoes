import { useEffect, useState } from 'react';
import Viewer3D from './Viewer3D.jsx';
import { lockScroll } from '../scroll.js';
import { openWhats } from '../config.js';

export default function ProductModal({ product: p, onClose, onAdd }) {
  const [view, setView] = useState('3d');
  const [photo, setPhoto] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  useEffect(() => {
    lockScroll(true);
    const k = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => { lockScroll(false); window.removeEventListener('keydown', k); };
  }, [onClose]);

  const add = () => { onAdd(p, qty); setAdded(true); setTimeout(() => setAdded(false), 1800); };
  const ask = () => openWhats(`Olá, WF Cordões e Acessórios! Vi o modelo 3D do(a) *${p.name}* no catálogo (60 cm, ${qty} un.).\nFoto: ${location.origin}${p.imgs[0]}\n\nPode me enviar fotos/vídeo da peça real e confirmar valor e disponibilidade?`);

  return (
    <div className="modal-wrap" data-lenis-prevent>
      <div className="modal-bg" onClick={onClose} />
      <div className="modal" role="dialog" aria-label={p.name}>
        <div className="modal-media">
          <div className="seg">
            <button className={view === '3d' ? 'on' : ''} onClick={() => setView('3d')}>Modelo 3D</button>
            <button className={view === 'foto' ? 'on' : ''} onClick={() => setView('foto')}>Foto real</button>
          </div>
          {view === '3d' ? (
            <>
              <Viewer3D spec={p.spec} fallback={p.imgs[0]} />
              <span className="hint"><span className="mouse">Arraste para girar · role para aproximar</span><span className="touch">Arraste para girar · pinça para aproximar</span></span>
            </>
          ) : (
            <>
              <img className="modal-photo" src={p.imgs[photo]} alt={p.name} />
              {p.imgs.length > 1 && (
                <div className="thumbs">
                  {p.imgs.map((s, i) => <button key={s} className={i === photo ? 'on' : ''} onClick={() => setPhoto(i)}><img src={s} alt="" /></button>)}
                </div>
              )}
            </>
          )}
        </div>
        <div className="modal-info">
          <button className="close" onClick={onClose}>Fechar ✕</button>
          <span className="eyebrow cyan">Modelo 3D</span>
          <h2 className="h2">{p.name}</h2>
          <p className="p desc">{p.desc}</p>
          <span className="specs">{p.sub} · 60 cm · 100% moeda antiga · lixado e polido</span>
          <div className="notice">
            <strong>Este é um modelo 3D ilustrativo.</strong> Finalize o pedido pelo WhatsApp para ver a peça real em fotos e vídeo e confirmar valor e disponibilidade.
          </div>
          <div className="buy-row">
            <div className="qty">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button><span>{qty}</span><button onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            <button className="btn-line" onClick={add}>{added ? 'Adicionado ✓' : 'Adicionar à sacola'}</button>
          </div>
          <button className="btn-gold full" onClick={ask}>Pedir pelo WhatsApp</button>
        </div>
      </div>
    </div>
  );
}
