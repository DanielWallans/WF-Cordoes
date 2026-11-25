import { CONFIG, waNumber, openWhats } from '../config.js';
import { scrollToSel } from '../scroll.js';
import Viewer3D from './Viewer3D.jsx';

const ACAB_SPEC = { chain: 'cartier', thickness: 'medio', pendant: 'cruz', pendantScale: 0.46 };

const go = sel => e => { e.preventDefault(); scrollToSel(sel); };

const ITEMS = [
  ['I', 'Moeda antiga', 'Todas as peças são produzidas 100% em moeda antiga. É a base de cada cordão e de cada acessório da WF.'],
  ['II', 'Lixadas e polidas', 'Cada peça passa por lixamento e polimento antes de chegar à vitrine. É o que dá ao dourado um reflexo limpo e contínuo.'],
  ['III', 'Os elos', 'O desenho do elo define o caimento no peito. Escolha o modelo no catálogo 3D — a WF orienta pelo WhatsApp.'],
  ['IV', 'Cuidados', 'Guarde cada peça separada, longe de perfume e umidade. Para limpar, use apenas uma flanela seca e macia.'],
  ['V', 'Identidade', 'Uma marca, uma história, um estilo. Dúvidas sobre qualquer peça são respondidas diretamente pela WF.'],
];

export function Acabamento() {
  return (
    <section id="acabamento" className="acab">
      <div data-reveal className="acab-head">
        <img src="/assets/wf-crown.png" alt="" />
        <h2 className="display-2">Acabamento que <span className="gold italic">se vê de perto.</span></h2>
      </div>
      <div className="acab-body">
        <div className="acab-img">
          <div className="acab-frame acab-3d"><Viewer3D spec={ACAB_SPEC} fallback="/assets/vitrine.jpg" /></div>
          <span className="caption">Modelo 3D · arraste para girar</span>
        </div>
        <div className="acab-list">
          {ITEMS.map(([n, t, d]) => (
            <div data-reveal key={n} className="acab-item">
              <span className="roman">{n}</span><h3>{t}</h3><span /><p className="p">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const Row = () => (
  <div className="mq-row">
    <span className="mq-txt">100% moeda antiga</span><span className="mq-dot logo"><img src="/assets/wf-logo.png" alt="WF" /></span>
    <span className="mq-txt"><em className="gold">Modelos</em> em 3D</span><span className="mq-dot"><img src="/assets/trevo-verde.jpg" alt="" /></span>
    <span className="mq-txt">Lixado e polido</span><span className="mq-dot"><img src="/assets/trevo-petroleo.jpg" alt="" /></span>
  </div>
);
export function Marquee() {
  return <section className="marquee"><div className="mq-track"><Row /><Row /></div></section>;
}

export function WhatsCta() {
  return (
    <section className="wcta">
      <h2 data-reveal className="display-2">Viu o modelo 3D? <span className="cyan italic">Veja a peça real no WhatsApp.</span></h2>
      <button data-reveal className="btn-cyan" onClick={() => openWhats('Olá, WF Cordões e Acessórios! Vi o catálogo 3D e gostaria de ver as peças reais.')}>Falar no WhatsApp</button>
    </section>
  );
}

export function Footer() {
  const h = CONFIG.instagramHandle;
  return (
    <footer id="contato" className="footer">
      <div className="footer-top">
        <img src="/assets/wf-logo.png" alt="WF Cordões e Acessórios" className="footer-logo" />
        <div className="footer-cols">
          <div><span className="eyebrow">Navegação</span><a href="#topo" onClick={go('#topo')}>Início</a><a href="#catalogo" onClick={go('#catalogo')}>Catálogo 3D</a><a href="#acabamento" onClick={go('#acabamento')}>Acabamento</a></div>
          <div><span className="eyebrow">Contato</span><a href={'https://instagram.com/' + h.replace('@', '')} target="_blank" rel="noopener">Instagram {h}</a><a href={'https://wa.me/' + waNumber()} target="_blank" rel="noopener">WhatsApp</a></div>
          <div className="narrow"><span className="eyebrow">Informações</span><span className="muted">{CONFIG.commercialInfo}</span></div>
        </div>
      </div>
      <div className="footer-bot"><span>© 2026 WF Cordões e Acessórios. Todos os direitos reservados.</span><span>Imagens do catálogo: modelos 3D ilustrativos</span></div>
    </footer>
  );
}

// ---------- Instagram ----------
const IG_PICS = ['trevo-verde-1', 'cruz-cartier-1', 'nossa-senhora-coracao-1', 'cadeado-grosso-1', 'trevo-petroleo-1', 'medalha-nossa-senhora-1'];
export function Instagram() {
  const h = CONFIG.instagramHandle, url = 'https://www.instagram.com/' + h.replace('@', '') + '/';
  return (
    <section className="insta">
      <div data-reveal className="insta-head">
        <span className="eyebrow cyan">Instagram</span>
        <h2 className="h2">Siga <a href={url} target="_blank" rel="noopener" className="gold italic">{h}</a></h2>
        <p className="p">Novidades, peças reais e vídeos da vitrine primeiro no Instagram.</p>
        <a className="btn-line insta-btn" href={url} target="_blank" rel="noopener">Ver perfil no Instagram ↗</a>
      </div>
      <div className="insta-grid">
        {IG_PICS.map(n => (
          <a key={n} href={url} target="_blank" rel="noopener" aria-label={'Instagram ' + h}>
            <img src={`/catalogo/thumbs/${n}.webp`} alt="" loading="lazy" decoding="async" />
          </a>
        ))}
      </div>
    </section>
  );
}

// ---------- Dúvidas ----------
const FAQ = [
  ['As imagens do catálogo são da peça real?', 'Os modelos do catálogo são em 3D, para você ver o formato e o caimento no busto. Em cada peça há também a "Foto real". Ao finalizar pelo WhatsApp, a WF envia fotos e vídeo da peça que você vai receber.'],
  ['Qual o comprimento das peças?', 'Todas as peças são em 60 cm.'],
  ['Do que são feitas?', 'Todas as peças são produzidas 100% em moeda antiga, lixadas e polidas.'],
  ['Como faço o pedido?', 'Adicione as peças à sacola e toque em "Finalizar pedido pelo WhatsApp". A mensagem já vai pronta com a lista — a WF responde com valores, disponibilidade e as fotos reais.'],
  ['Como pago e como recebo?', 'Formas de pagamento, prazos e entrega são combinados diretamente com a WF pelo WhatsApp.'],
  ['Como cuido da minha peça?', 'Guarde cada peça separada, longe de perfume e umidade. Para limpar, use apenas uma flanela seca e macia.'],
];
export function Faq() {
  return (
    <section id="duvidas" className="faq">
      <div data-reveal className="faq-head">
        <span className="eyebrow cyan">Dúvidas</span>
        <h2 className="h2">Perguntas <span className="gold italic">frequentes.</span></h2>
      </div>
      <div className="faq-list">
        {FAQ.map(([q, a]) => (
          <details key={q} className="faq-item">
            <summary>{q}<span>+</span></summary>
            <p className="p">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

// ---------- Botão flutuante do WhatsApp ----------
export function WhatsFloat({ hidden }) {
  return (
    <button className={'wfloat' + (hidden ? ' off' : '')} aria-label="Falar no WhatsApp"
      onClick={() => openWhats('Olá, WF Cordões e Acessórios! Vim pelo site e gostaria de ver as peças.')}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>
      <span>WhatsApp</span>
    </button>
  );
}
