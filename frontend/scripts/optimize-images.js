import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SRC = path.resolve('src/assets');
const OUT = path.resolve('public/assets');

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(SRC).filter(f => /\.(jpe?g|png|webp)$/i.test(f));

(async () => {
  for (const file of files) {
    try {
      const srcPath = path.join(SRC, file);
      const outPath = path.join(OUT, file);
      const stat = fs.statSync(srcPath);

      // If file is large (>300KB), produce a compressed copy and a thumbnail
      if (stat.size > 300 * 1024) {
        console.log(`Optimizing ${file} (${Math.round(stat.size/1024)} KB)`);
        await sharp(srcPath)
          .resize({ width: 1200, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(outPath.replace(/\.[^.]+$/, '.webp'));

        // thumbnail
        const thumbPath = path.join(OUT, file.replace(/\.[^.]+$/, '.thumb.webp'));
        await sharp(srcPath)
          .resize({ width: 400 })
          .webp({ quality: 70 })
          .toFile(thumbPath);
      } else {
        // small files: just copy
        fs.copyFileSync(srcPath, outPath);
      }
    } catch (err) {
      console.error('Failed to process', file, err.message);
    }
  }
  console.log('Image optimization complete. Assets copied to public/assets. Update references to /assets/<name> to avoid bundling in JS.');
})();
