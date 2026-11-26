import { useEffect } from 'react';
import { lockScroll } from '../scroll.js';

export default function CartDrawer({ items, onClose, onUpdate, onRemove, onCheckout }) {
  useEffect(() => { lockScroll(true); return () => lockScroll(false); }, []);
  return (
    <div className="modal-wrap" data-lenis-prevent>
      <div className="modal-bg" onClick={onClose} />
      <aside className="drawer">
        <div className="drawer-head"><span className="drawer-title">Sacola</span><button className="close" onClick={onClose}>Fechar</button></div>
        <div className="drawer-body">
          {!items.length && <p className="p">Sua sacola está vazia. Escolha um modelo 3D no catálogo e adicione.</p>}
          {items.map(i => (
            <div key={i.id} className="line">
              <img src={i.img} alt="" />
              <div className="line-info">
                <span className="line-name">{i.name}</span>
                <span className="card-sub">{i.sub} · 60 a 70 cm</span>
                <div className="qty sm"><button onClick={() => onUpdate(i.id, -1)}>−</button><span>{i.qty}</span><button onClick={() => onUpdate(i.id, 1)}>+</button></div>
              </div>
              <button className="link" onClick={() => onRemove(i.id)}>Remover</button>
            </div>
          ))}
        </div>
        <div className="drawer-foot">
          <span className="card-sub">As imagens do catálogo são modelos 3D. Ao finalizar, a WF envia fotos e vídeo das peças reais e confirma valores pelo WhatsApp.</span>
          <button className="btn-gold full" style={{ opacity: items.length ? 1 : 0.4 }} onClick={onCheckout}>Finalizar pedido pelo WhatsApp</button>
        </div>
      </aside>
    </div>
  );
}
