# WF Cordões e Acessórios

Site da WF Cordões e Acessórios, marca de cordões e pingentes produzidos 100% em moeda antiga, lixados e polidos, todos em 60 cm.

O site funciona como uma vitrine digital. O cliente conhece a marca, navega pelo catálogo, vê cada peça em 3D e envia o pedido direto para o WhatsApp da loja. Não há preços nem pagamento online: valores, disponibilidade e entrega são combinados na conversa.

## Como funciona

**Abertura em 3D.** A página abre com um busto preto e um cordão dourado renderizados em tempo real. Conforme a pessoa rola a página, a câmera se move pela peça e apresenta a marca em cinco capítulos.

**Catálogo 3D.** São 20 peças em grade, com filtros por categoria (cordões, com pingente, religiosos e trevos). Cada peça tem foto real, descrição curta e um modelo 3D. Ao abrir uma peça, o cliente gira e aproxima o modelo no busto ou alterna para a foto real.

**Modelos 3D.** Não usam arquivos de modelagem. Cada peça é gerada a partir de uma descrição: tipo de corrente (cadeado, cartier, grumet, piastrine ou box), espessura e pingente (cruz, escapulário, placa, medalha, coração, escudo ou trevos). Os modelos são ilustrativos, e o site deixa isso claro em todas as etapas.

**Sacola e pedido.** O cliente adiciona peças à sacola, que fica salva no navegador. Ao finalizar, o WhatsApp abre com uma mensagem pronta: lista das peças, comprimento, quantidade e o link da foto de cada uma. A loja responde com fotos e vídeo da peça real.

**Demais seções.** Acabamento da marca (com modelo 3D interativo), faixa animada, link do Instagram, perguntas frequentes e um botão de WhatsApp sempre visível.

**Celular.** No celular, o 3D usa menor resolução, não calcula sombras e só é desenhado quando a peça se move. A rolagem é a nativa do aparelho e as fotos do catálogo usam miniaturas leves em WebP. Em aparelhos sem suporte a 3D, o site mostra as fotos no lugar dos modelos.

**Compartilhamento.** Título, descrição e imagem de prévia configurados para Google e WhatsApp. Cada peça tem link próprio (`/#p=nome-da-peca`).

## Tecnologias

- React + Vite
- Three.js para o busto e as joias em 3D
- GSAP (ScrollTrigger) para as animações de rolagem
- Lenis para a rolagem suave no computador

## Organização

| Caminho | Conteúdo |
|---|---|
| `src/config.js` | WhatsApp, Instagram e informações da loja |
| `src/data/products.js` | Catálogo: nome, descrição, fotos e descrição do modelo 3D de cada peça |
| `src/three/JewelryStage.js` | Motor 3D: busto, correntes, pingentes, luz e câmera |
| `src/components/` | Seções da página (abertura, catálogo, janela da peça, sacola, rodapé…) |
| `src/styles.css` | Estilos do site |
| `public/catalogo/` | Fotos das peças e suas miniaturas (`thumbs/`) |
| `public/assets/` | Logo e imagens da marca |
| `scripts/thumbs.mjs` | Gera as miniaturas do catálogo e a imagem de compartilhamento |

---

© 2026 WF Cordões e Acessórios. Todos os direitos reservados.
