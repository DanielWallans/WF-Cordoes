import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { scroller } from './scroll.js';
import { openWhats, LENGTHS } from './config.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Catalog from './components/Catalog.jsx';
import ProductModal from './components/ProductModal.jsx';
import { Acabamento, Marquee, WhatsCta, Footer, Faq, Instagram, WhatsFloat } from './components/Sections.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import { PRODUCTS } from './data/products.js';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [cart, setCart] = useState(() => { try { return (JSON.parse(localStorage.getItem('wf-cart')) || []).map(i => i.k && LENGTHS.includes(i.len) ? i : { ...i, len: LENGTHS[0], k: `${i.id}-${LENGTHS[0]}` }); } catch { return []; } });
  const [cartOpen, setCartOpen] = useState(false);
  // Link direto para uma peça: site.com/#p=cruz-cartier
  const [product, setProduct] = useState(() => PRODUCTS.find(p => location.hash === '#p=' + p.id) || null);
  useEffect(() => { history.replaceState(null, '', product ? '#p=' + product.id : location.pathname); }, [product]);

  useEffect(() => { localStorage.setItem('wf-cart', JSON.stringify(cart)); }, [cart]);

  useEffect(() => {
    // No celular usa a rolagem nativa (mais fluida e sem travar)
    const touch = matchMedia('(pointer:coarse)').matches;
    const lenis = touch ? null : new Lenis({ lerp: 0.075, wheelMultiplier: 0.9, smoothWheel: true });
    scroller.lenis = lenis;
    if (lenis) lenis.on('scroll', ScrollTrigger.update);
    const tick = t => lenis && lenis.raf(t * 1000);
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.utils.toArray('[data-reveal]').forEach(el => gsap.from(el, { y: 50, autoAlpha: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));
    });
    const t = setTimeout(() => ScrollTrigger.refresh(), 800);
    return () => { clearTimeout(t); ctx.revert(); gsap.ticker.remove(tick); lenis && lenis.destroy(); scroller.lenis = null; };
  }, []);

  // Cada linha da sacola é peça + comprimento (a mesma peça em 60 e 70 cm são linhas diferentes)
  const add = (p, qty = 1, len = LENGTHS[0]) => setCart(c => {
    const k = `${p.id}-${len}`;
    const ex = c.find(i => i.k === k);
    return ex ? c.map(i => i.k === k ? { ...i, qty: i.qty + qty } : i) : [...c, { k, id: p.id, name: p.name, sub: p.sub, img: p.thumb, len, qty }];
  });
  const update = (k, d) => setCart(c => c.map(i => i.k === k ? { ...i, qty: i.qty + d } : i).filter(i => i.qty > 0));
  const setLen = (k, len) => setCart(c => {
    const it = c.find(i => i.k === k); const nk = `${it.id}-${len}`;
    const other = c.find(i => i.k === nk);
    if (other) return c.filter(i => i.k !== k).map(i => i.k === nk ? { ...i, qty: i.qty + it.qty } : i);
    return c.map(i => i.k === k ? { ...i, k: nk, len } : i);
  });
  const remove = k => setCart(c => c.filter(i => i.k !== k));
  const checkout = () => {
    if (!cart.length) return;
    openWhats('Olá, WF Cordões e Acessórios! Vi os modelos 3D no catálogo e gostaria de finalizar este pedido:\n\n'
      + cart.map(i => `• ${i.name} — ${i.len} cm — ${i.qty} un.
  Foto: ${location.origin}/catalogo/${i.id}-1.jpg`).join('\n')
      + '\n\nPode me enviar fotos/vídeo das peças reais e confirmar valores e disponibilidade?');
  };

  return (
    <div className="app">
      <Header count={cart.reduce((a, i) => a + i.qty, 0)} onCart={() => setCartOpen(true)} />
      <Hero />
      <Catalog onOpen={setProduct} onAdd={add} cart={cart} />
      <Acabamento />
      <Marquee />
      <Instagram />
      <Faq />
      <WhatsCta />
      <Footer />
      <WhatsFloat hidden={!!product || cartOpen} />
      {product && <ProductModal product={product} onClose={() => setProduct(null)} onAdd={add} />}
      {cartOpen && <CartDrawer items={cart} onClose={() => setCartOpen(false)} onUpdate={update} onLen={setLen} onRemove={remove} onCheckout={checkout} />}
    </div>
  );
}
