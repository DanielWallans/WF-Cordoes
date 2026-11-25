// Gera as miniaturas .webp do catálogo e a imagem de compartilhamento (npm run thumbs)
import sharp from 'sharp'; import fs from 'fs';
const dir = 'public/catalogo';
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.jpg'))) {
  await sharp(`${dir}/${f}`).resize(640).webp({ quality: 72 }).toFile(`${dir}/thumbs/${f.replace('.jpg', '.webp')}`);
}
await sharp('public/assets/vitrine.jpg').resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 80 }).toFile('public/og-image.jpg');
console.log('ok');
