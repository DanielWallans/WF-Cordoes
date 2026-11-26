// Gera as miniaturas .webp do catálogo e a imagem de compartilhamento (npm run thumbs)
import sharp from 'sharp'; import fs from 'fs';
const dir = 'public/catalogo';
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.jpg'))) {
  await sharp(`${dir}/${f}`).resize(640).webp({ quality: 72 }).toFile(`${dir}/thumbs/${f.replace('.jpg', '.webp')}`);
}
const logo = await sharp('public/assets/wf-logo.png').resize({ width: 560 }).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#0b0b0b' } }).composite([{ input: logo, gravity: 'center' }]).jpeg({ quality: 88 }).toFile('public/og-logo.jpg');
console.log('ok');
