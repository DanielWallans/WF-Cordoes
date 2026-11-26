// Edite aqui os dados de contato da loja.
export const CONFIG = {
  whatsappNumber: '5527995760010', // DDI + DDD + número, só dígitos
  instagramHandle: '@wf_cordoes',
  commercialInfo: 'Cidade — UF · Atendimento pelo WhatsApp',
};
export const waNumber = () => CONFIG.whatsappNumber.replace(/\D/g, '');
export const openWhats = msg => window.open(`https://wa.me/${waNumber()}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
// Comprimentos oferecidos (cm). O primeiro é o padrão.
export const LENGTHS = [60, 70];
