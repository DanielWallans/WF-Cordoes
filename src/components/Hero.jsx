import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { JewelryStage, hasWebGL } from '../three/JewelryStage.js';
import { scrollToSel } from '../scroll.js';

const HERO_SPEC = { chain: 'cadeado', thickness: 'grosso', accent: '#22E4F2' };

export default function Hero() {
  const root = useRef(null), stageHost = useRef(null), bar = useRef(null);
  const [noWebgl, setNoWebgl] = useState(false);

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let stage = null;
    if (hasWebGL()) {
      try { stage = new JewelryStage(stageHost.current, { mode: 'hero' }); stage.setSpec(HERO_SPEC); }
      catch (e) { console.warn('3D desativado:', e); setNoWebgl(true); }
    } else setNoWebgl(true);
    const S = stage ? stage.S : {}, I = stage ? stage.I : {};
    if (stage && !reduce) Object.assign(I, { dolly: 4, light: 0, rise: -0.35 });

    const ctx = gsap.context(() => {
      const ch = gsap.utils.toArray('[data-chapter]');
      ch.slice(1).forEach(el => gsap.set(el, { autoAlpha: 0, y: 30 }));
      const tl = gsap.timeline({ defaults: { ease: 'power1.inOut' }, scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: matchMedia('(pointer:coarse)').matches ? 0.5 : 1.6,
        onUpdate: s => { if (bar.current) bar.current.style.transform = `scaleY(${s.progress})`; } } });
      const chap = (i, a, b) => { tl.fromTo(ch[i], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, a); if (b != null) tl.to(ch[i], { autoAlpha: 0, y: -30, duration: 0.3, ease: 'power2.in' }, b); };
      tl.to(ch[0], { autoAlpha: 0, y: -40, duration: 0.35, ease: 'none' }, 0.05);
      tl.to(S, { rotY: 0.72, gx: -1.05, cx: 1.5, cy: 1.3, cz: 6.4, tx: 0, ty: 0.4, la: -0.5, duration: 1 }, 0);
      chap(1, 0.55, 1.3);
      tl.to(S, { rotY: -1.05, gx: 1.05, cx: -1.8, cy: 1.7, cz: 7.2, ty: -0.05, la: 0.95, duration: 1 }, 1);
      chap(2, 1.55, 2.3);
      tl.to(S, { rotY: 0.12, gx: 0, cx: 1.15, cy: -0.5, cz: 2.4, tx: 0.45, ty: -0.85, tz: 0.32, la: 0.35, duration: 1 }, 2);
      chap(3, 2.55, 3.3);
      tl.to(S, { rotY: 0, gx: 1.05, cx: 0, cy: 0.35, cz: 9.4, tx: 0, ty: -0.15, tz: 0, la: 0.55, duration: 1 }, 3);
      chap(4, 3.55);
      tl.to({}, { duration: 0.45 }, 4);

      const loader = root.current.querySelector('[data-loader]'), lines = root.current.querySelectorAll('[data-intro-line]'), fades = root.current.querySelectorAll('[data-intro-fade]');
      if (reduce) { gsap.set(loader, { autoAlpha: 0 }); return; }
      gsap.set(lines, { yPercent: 110 }); gsap.set(fades, { autoAlpha: 0 });
      gsap.to(loader, { autoAlpha: 0, duration: 1, ease: 'power2.out' });
      if (stage) { gsap.to(I, { dolly: 0, rise: 0, duration: 3.4, ease: 'power3.out' }); gsap.to(I, { light: 1, duration: 2.6, ease: 'power2.inOut', delay: 0.2 }); }
      gsap.to(lines, { yPercent: 0, duration: 1.4, ease: 'power4.out', stagger: 0.09, delay: 1 });
      gsap.to(fades, { autoAlpha: 1, duration: 1.2, delay: 2 });
    }, root);
    return () => { ctx.revert(); stage && stage.dispose(); };
  }, []);

  const L = ({ children, className = '' }) => <span className="mask"><span data-intro-line className={className}>{children}</span></span>;

  return (
    <section id="topo" ref={root} className="hero">
      <div className="hero-sticky">
        <div className="hero-glow" />
        <div ref={stageHost} className="hero-stage" />
        {noWebgl && <img className="hero-fallback" src="/assets/vitrine.jpg" alt="Busto com cordão" />}
        <div className="hero-shade" />
        <div data-loader className="hero-loader"><img src="/assets/wf-crown.png" alt="" /></div>

        <div data-chapter className="chapter chapter-0">
          <L className="eyebrow">100% moeda antiga</L>
          <h1 className="display">
            <L>Uma marca.</L><L>Uma história.</L><L className="gold italic">Um estilo.</L>
          </h1>
          <L className="lead">Descubra nossa coleção de cordões e acessórios em moeda antiga — agora em modelos 3D.</L>
          <span data-intro-fade className="row">
            <button className="btn-gold" onClick={() => scrollToSel('#catalogo')}>Ver catálogo 3D</button>
          </span>
        </div>

        <div data-intro-fade className="hero-progress">
          <div className="hero-nums"><span>01</span><span>02</span><span>03</span><span>04</span><span>05</span></div>
          <span className="hero-track"><span ref={bar} className="hero-bar" /></span>
        </div>

        <div data-chapter className="chapter chapter-right">
          <span className="eyebrow cyan">02 — A vitrine</span>
          <h2 className="h2">Feito para ser visto.</h2>
          <p className="p">O busto preto deixa o dourado falar sozinho. Do pescoço ao peito, a corrente desenha a linha que o olhar segue.</p>
        </div>
        <div data-chapter className="chapter chapter-left">
          <span className="eyebrow cyan">03 — O metal</span>
          <h2 className="h2">100% <span className="gold italic">moeda antiga.</span></h2>
          <p className="p">Cada peça da WF é produzida inteiramente em moeda antiga. O tom do dourado muda conforme a luz — e conforme o ângulo.</p>
        </div>
        <div data-chapter className="chapter chapter-bottom">
          <span className="eyebrow cyan">04 — Detalhe</span>
          <h2 className="h2">Elo por elo.</h2>
          <p className="p">Peças lixadas e polidas. De perto, o acabamento aparece no encaixe de cada elo e no reflexo contínuo da corrente.</p>
        </div>
        <div data-chapter className="chapter chapter-left">
          <span className="eyebrow cyan">05 — Catálogo 3D</span>
          <h2 className="h2">Todas as peças <span className="gold italic">em 3D.</span></h2>
          <p className="p">Gire, aproxime e veja cada modelo no busto. Monte sua sacola e finalize o pedido pelo WhatsApp para ver a peça real.</p>
          <button className="btn-gold" onClick={() => scrollToSel('#catalogo')}>Abrir catálogo</button>
        </div>
      </div>
    </section>
  );
}
