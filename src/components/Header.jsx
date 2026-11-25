import { scrollToSel } from '../scroll.js';
const go = sel => e => { e.preventDefault(); scrollToSel(sel); };
export default function Header({ count, onCart }) {
  return (
    <header className="header">
      <a href="#topo" onClick={go('#topo')} className="header-logo"><img src="/assets/wf-logo.png" alt="WF Cordões e Acessórios" /></a>
      <nav className="header-nav">
        <a href="#catalogo" onClick={go('#catalogo')}>Catálogo 3D</a>
        <a href="#acabamento" onClick={go('#acabamento')} className="hide-sm">Acabamento</a>
        <a href="#contato" onClick={go('#contato')} className="hide-sm">Contato</a>
        <button className="bag-btn" onClick={onCart}>Sacola <span>{count}</span></button>
      </nav>
    </header>
  );
}
