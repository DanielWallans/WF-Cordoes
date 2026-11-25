import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { scroller } from './scroll.js';
import { openWhats } from './config.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Catalog from './components/Catalog.jsx';
import ProductModal from './components/ProductModal.jsx';
import { Acabamento, Marquee, WhatsCta, Footer, Faq, Instagram, WhatsFloat } from './components/Sections.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import { PRODUCTS } from './data/products.js';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem('wf-cart')) || []; } catch { return []; } });
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
      gsap.utils.toArray('[data-reveal-img]').forEach(el => gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'power4.inOut', scrollTrigger: { trigger: el, start: 'top 85%' } }));
    });
    const t = setTimeout(() => ScrollTrigger.refresh(), 800);
    return () => { clearTimeout(t); ctx.revert(); gsap.ticker.remove(tick); lenis && lenis.destroy(); scroller.lenis = null; };
  }, []);

  const add = (p, qty = 1) => setCart(c => {
    const ex = c.find(i => i.id === p.id);
    return ex ? c.map(i => i.id === p.id ? { ...i, qty: i.qty + qty } : i) : [...c, { id: p.id, name: p.name, sub: p.sub, img: p.thumb, qty }];
  });
  const update = (id, d) => setCart(c => c.map(i => i.id === id ? { ...i, qty: i.qty + d } : i).filter(i => i.qty > 0));
  const remove = id => setCart(c => c.filter(i => i.id !== id));
  const checkout = () => {
    if (!cart.length) return;
    openWhats('Olá, WF Cordões e Acessórios! Vi os modelos 3D no catálogo e gostaria de finalizar este pedido:\n\n'
      + cart.map(i => `• ${i.name} — 60 cm — ${i.qty} un.
  📷 ${location.origin}/catalogo/${i.id}-1.jpg`).join('\n')
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
      {cartOpen && <CartDrawer items={cart} onClose={() => setCartOpen(false)} onUpdate={update} onRemove={remove} onCheckout={checkout} />}
    </div>
  );
}
