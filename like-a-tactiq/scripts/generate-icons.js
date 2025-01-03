const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateIcons() {
  const sizes = [16, 32, 48, 128];
  const sourcePath = path.join(__dirname, '../../hello-world/hello_extensions.png');
  const sourceBuffer = await fs.readFile(sourcePath);

  const imagesDir = path.join(__dirname, '../images');
  try {
    await fs.access(imagesDir);
  } catch {
    await fs.mkdir(imagesDir);
  }

  for (const size of sizes) {
    await sharp(sourceBuffer)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(imagesDir, `icon-${size}.png`));
  }
}

generateIcons().catch(error => {
  console.error('Error generating icons:', error);
  process.exit(1);
}); 