// Catálogo WF — sem preços. Cada peça tem um modelo 3D gerado a partir do "spec".
// chain: cadeado | cartier | grumet | piastrine | box
// thickness: fino | medio | grosso
// pendant: cruz | placa-cruz | placa | medalha-oval | medalha-cruz | coracao | escudo
const img = n => `/catalogo/${n}.jpg`;

export const CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'cordoes', label: 'Cordões' },
  { id: 'pingentes', label: 'Com pingente' },
  { id: 'religiosos', label: 'Religiosos' },
  { id: 'trevos', label: 'Trevos' },
];

const LIST = [
  { id: 'cadeado-grosso', name: 'Cordão Cadeado Grosso', cats: ['cordoes'], sub: 'Elo cadeado largo', imgs: [img('cadeado-grosso-1')], spec: { chain: 'cadeado', thickness: 'grosso' } },
  { id: 'nossa-senhora-coracao', name: 'Nossa Senhora Coração', cats: ['pingentes', 'religiosos'], sub: 'Cartier fino com coração vazado', imgs: [img('nossa-senhora-coracao-1'), img('nossa-senhora-coracao-2')], spec: { chain: 'cartier', thickness: 'fino', pendant: 'coracao', figure: true, pendantScale: 0.4 } },
  { id: 'trevo-verde', name: 'Colar Trevo Verde', cats: ['trevos'], sub: 'Corrente fina, 5 trevos', imgs: [img('trevo-verde-1'), img('trevo-verde-2')], spec: { chain: 'cadeado', thickness: 'fino', clover: '#1FA83F', accent: '#B6FF3B' } },
  { id: 'escapulario-cruz', name: 'Escapulário Cruz', cats: ['pingentes', 'religiosos'], sub: 'Placa preta com cruz dourada', imgs: [img('escapulario-cruz-1')], spec: { chain: 'cartier', thickness: 'fino', pendant: 'placa-cruz', pendantScale: 0.36 } },
  { id: 'medalha-nossa-senhora', name: 'Medalha Nossa Senhora', cats: ['pingentes', 'religiosos'], sub: 'Grumet com medalha oval', imgs: [img('medalha-nossa-senhora-1')], spec: { chain: 'grumet', thickness: 'medio', pendant: 'medalha-oval', matte: true, pendantScale: 0.5 } },
  { id: 'cruz-cartier', name: 'Cruz Cartier', cats: ['pingentes', 'religiosos'], sub: 'Cartier com cruz polida', imgs: [img('cruz-cartier-1')], spec: { chain: 'cartier', thickness: 'medio', pendant: 'cruz', pendantScale: 0.46 } },
  { id: 'trevo-petroleo', name: 'Colar Trevo Petróleo', cats: ['trevos'], sub: 'Corrente fina, 5 trevos', imgs: [img('trevo-petroleo-1')], spec: { chain: 'cadeado', thickness: 'fino', clover: '#0E5966', accent: '#1F8FB8' } },
  { id: 'placa-escapulario', name: 'Placa Escapulário', cats: ['pingentes', 'religiosos'], sub: 'Cartier fino com placa em relevo', imgs: [img('placa-escapulario-1')], spec: { chain: 'cartier', thickness: 'fino', pendant: 'placa', pendantScale: 0.36 } },
  { id: 'medalha-cruz-vazada', name: 'Medalha Cruz Vazada', cats: ['pingentes', 'religiosos'], sub: 'Piastrine com medalha vazada', imgs: [img('medalha-cruz-vazada-1')], spec: { chain: 'piastrine', thickness: 'fino', pendant: 'medalha-cruz', matte: true, pendantScale: 0.4 } },
  { id: 'escudo-cartier', name: 'Pingente Escudo', cats: ['pingentes'], sub: 'Cartier com escudo listrado', imgs: [img('escudo-cartier-1')], spec: { chain: 'cartier', thickness: 'medio', pendant: 'escudo', matte: true, pendantScale: 0.42 } },
  { id: 'coracao-cravejado', name: 'Coração Cravejado', cats: ['pingentes'], sub: 'Cartier fino com coração', imgs: [img('coracao-cravejado-1'), img('coracao-cravejado-2')], spec: { chain: 'cartier', thickness: 'fino', pendant: 'coracao', pendantScale: 0.4 } },
  { id: 'cadeado-medio', name: 'Cordão Cadeado Médio', cats: ['cordoes'], sub: 'Elo cadeado clássico', imgs: [img('cadeado-medio-1')], spec: { chain: 'cadeado', thickness: 'medio' } },
  { id: 'cartier-grosso', name: 'Cordão Cartier Grosso', cats: ['cordoes'], sub: 'Elos alongados largos', imgs: [img('cartier-grosso-1')], spec: { chain: 'cartier', thickness: 'grosso' } },
  { id: 'grumet-fino', name: 'Cordão Grumet Fino', cats: ['cordoes'], sub: 'Elos torcidos e achatados', imgs: [img('grumet-fino-1')], spec: { chain: 'grumet', thickness: 'fino' } },
  { id: 'grumet-mini', name: 'Cordão Grumet Mini', cats: ['cordoes'], sub: 'Grumet delicado', imgs: [img('grumet-mini-1')], spec: { chain: 'grumet', thickness: 'fino' } },
  { id: 'grumet-alongado', name: 'Grumet Alongado', cats: ['cordoes'], sub: 'Elos grumet alongados', imgs: [img('grumet-alongado-1')], spec: { chain: 'piastrine', thickness: 'medio' } },
  { id: 'cartier-fino', name: 'Cordão Cartier Fino', cats: ['cordoes'], sub: 'Elos alongados finos', imgs: [img('cartier-fino-1')], spec: { chain: 'cartier', thickness: 'fino' } },
  { id: 'cartier-classico', name: 'Cartier Clássico', cats: ['cordoes'], sub: 'Cartier fino tradicional', imgs: [img('cartier-classico-1')], spec: { chain: 'cartier', thickness: 'fino' } },
  { id: 'piastrine-fino', name: 'Cordão Piastrine Fino', cats: ['cordoes'], sub: 'Elos planos espelhados', imgs: [img('piastrine-fino-1')], spec: { chain: 'piastrine', thickness: 'fino' } },
  { id: 'box-fino', name: 'Cordão Box Fino', cats: ['cordoes'], sub: 'Elos quadrados', imgs: [img('box-fino-1')], spec: { chain: 'box', thickness: 'fino' } },
];

// Texto curto de cada peça
const DESC = {
  'cadeado-grosso': 'Presença forte no peito. Peça de destaque para usar sozinha.',
  'nossa-senhora-coracao': 'Proteção e delicadeza. Ótima opção para presente.',
  'trevo-verde': 'Clássico atemporal com trevos em verde. Combina com looks claros e escuros.',
  'escapulario-cruz': 'Contraste do preto com o dourado. Discreto e marcante.',
  'medalha-nossa-senhora': 'Medalha com acabamento fosco e corrente grumet encorpada.',
  'cruz-cartier': 'A cruz polida mais pedida, na corrente cartier.',
  'trevo-petroleo': 'Trevos em azul petróleo, cor elegante e fácil de combinar.',
  'placa-escapulario': 'Placa com relevo trabalhado. Peça unissex.',
  'medalha-cruz-vazada': 'Medalha com cruz vazada em corrente piastrine. Leve no dia a dia.',
  'escudo-cartier': 'Escudo listrado para quem leva o time no peito.',
  'coracao-cravejado': 'Coração com brilho, na medida para o dia a dia.',
  'cadeado-medio': 'O cadeado na espessura certa: ideal para usar com pingente.',
  'cartier-grosso': 'Elos alongados largos, visual moderno. Peça unissex.',
  'grumet-fino': 'Fino e reflexivo. Ideal para usar com pingente.',
  'grumet-mini': 'O mais delicado da coleção. Perfeito para sobrepor.',
  'grumet-alongado': 'Elos achatados que refletem bem a luz. Peça unissex.',
  'cartier-fino': 'Leve e versátil. Ideal para usar com pingente.',
  'cartier-classico': 'O básico que combina com tudo.',
  'piastrine-fino': 'Elos planos espelhados, brilho contínuo.',
  'box-fino': 'Elos quadrados firmes. Ótimo para pingentes leves.',
};
const thumb = s => s.replace('/catalogo/', '/catalogo/thumbs/').replace('.jpg', '.webp');
export const PRODUCTS = LIST.map(p => ({ ...p, desc: DESC[p.id], thumb: thumb(p.imgs[0]), thumb2: p.imgs[1] && thumb(p.imgs[1]) }));
