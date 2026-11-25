import { useMemo, useState } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/products.js';

const Heart = ({ on }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
);
export const Cube = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2 3 7v10l9 5 9-5V7z" /><path d="M3 7l9 5 9-5M12 12v10" /></svg>
);

export default function Catalog({ onOpen, onAdd, cart }) {
  const [cat, setCat] = useState('todos');
  const [favs, setFavs] = useState({});
  const list = useMemo(() => (cat === 'todos' ? PRODUCTS : PRODUCTS.filter(p => p.cats.includes(cat))), [cat]);
  const inCart = id => cart.some(i => i.id === id);

  return (
    <section id="catalogo" className="catalog">
      <div className="crumbs">Início <span>→</span> Catálogo <span>→</span> <em>{CATEGORIES.find(c => c.id === cat).label}</em></div>
      <div className="catalog-head">
        <h2 className="catalog-title">Catálogo WF <sup>{list.length}</sup></h2>
        <p className="catalog-note"><Cube /> Todas as peças são <strong>modelos 3D</strong> — gire e aproxime no busto. Monte sua sacola e <strong>finalize o pedido pelo WhatsApp</strong> para ver a peça real.</p>
      </div>
      <div className="catalog-bar">
        <div className="chips">
          {CATEGORIES.map(c => (
            <button key={c.id} className={'chip' + (c.id === cat ? ' on' : '')} onClick={() => setCat(c.id)}>{c.label}</button>
          ))}
        </div>
        <span className="chip ghost"><Cube /> Modelos 3D</span>
      </div>

      <div className="grid">
        {list.map(p => (
          <article key={p.id} className="card">
            <div className="card-media" onClick={() => onOpen(p)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onOpen(p)} aria-label={`Ver ${p.name} em 3D`}>
              <img src={p.thumb} alt={p.name} loading="lazy" decoding="async" className="img-a" />
              {p.thumb2 && <img src={p.thumb2} alt="" loading="lazy" className="img-b" />}
              <span className="tag"><Cube /> Modelo 3D</span>
              <button className={'fav' + (favs[p.id] ? ' on' : '')} aria-label="Favoritar" onClick={e => { e.stopPropagation(); setFavs(f => ({ ...f, [p.id]: !f[p.id] })); }}><Heart on={favs[p.id]} /></button>
              <span className="card-cta">Ver em 3D</span>
            </div>
            <div className="card-info">
              <div>
                <h3>{p.name}</h3>
                <span className="card-sub">{p.sub} · 60 cm</span>
              </div>
              <button className={'card-add' + (inCart(p.id) ? ' on' : '')} onClick={() => onAdd(p)}>{inCart(p.id) ? 'Na sacola ✓' : '+ Sacola'}</button>
            </div>
            <div className="swatches">
              <i style={{ background: '#E2B660' }} />
              {p.spec.clover && <i style={{ background: p.spec.clover }} />}
              {(p.spec.pendant === 'placa-cruz' || p.spec.pendant === 'coracao') && <i style={{ background: '#111' }} />}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
