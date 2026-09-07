const { injectManifest } = require('workbox-build');
const path = require('path');

(async () => {
  try {
    const root = process.cwd();
    const swSrc = path.join(root, 'src', 'sw.js');
    const swDest = path.join(root, 'dist', 'sw.js');

    console.log('Generating service worker from', swSrc);

    const { count, size, warnings } = await injectManifest({
      swSrc,
      swDest,
      globDirectory: path.join(root, 'dist'),
      globPatterns: [
        '**/*.{html,js,css,png,jpg,jpeg,svg,gif,webp,ico,json,woff2,woff,ttf}'
      ],
    });

    warnings.forEach(w => console.warn(w));
    console.log(`Precached ${count} files, totaling ${size} bytes.`);
    console.log('Service worker generated at', swDest);
  } catch (err) {
    console.error('Failed to generate service worker:', err);
    process.exit(1);
  }
})();
