// Instância compartilhada do Lenis (rolagem suave)
export const scroller = { lenis: null };
export function scrollToSel(sel, duration = 1.8) {
  const el = typeof sel === 'string' ? document.querySelector(sel) : sel;
  if (!el) return;
  if (scroller.lenis) scroller.lenis.scrollTo(el, { duration });
  else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY, behavior: 'smooth' });
}
export const lockScroll = on => { if (scroller.lenis) on ? scroller.lenis.stop() : scroller.lenis.start(); document.documentElement.style.overflow = on ? 'hidden' : ''; };
