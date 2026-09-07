import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type Plugin } from 'vite';

function inlineCss(): Plugin {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',

    generateBundle(_options, bundle) {
      const cssFiles: string[] = [];

      // Collect generated CSS assets
      for (const [fileName, asset] of Object.entries(bundle)) {
        if (
          asset.type === 'asset' &&
          fileName.endsWith('.css')
        ) {
          cssFiles.push(fileName);
        }
      }

      if (cssFiles.length === 0) {
        return;
      }

      // Usually there is one CSS file, but handle multiple safely.
      const css = cssFiles
        .map((fileName) => {
          const asset = bundle[fileName];

          if (asset?.type !== 'asset') {
            return '';
          }

          return typeof asset.source === 'string'
            ? asset.source
            : new TextDecoder().decode(asset.source);
        })
        .join('\n');

      // Find every generated HTML file
      for (const [fileName, asset] of Object.entries(bundle)) {
        if (
          asset.type !== 'asset' ||
          !fileName.endsWith('.html') ||
          typeof asset.source !== 'string'
        ) {
          continue;
        }

        let html = asset.source;

        for (const cssFile of cssFiles) {
          const escaped = cssFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

          html = html.replace(
            new RegExp(
              `<link[^>]+href=["'][^"']*${escaped}["'][^>]*>`,
              'gi'
            ),
            ''
          );
        }

        html = html.replace(
          '</head>',
          `<style>${css}</style>\n</head>`
        );

        asset.source = html;
      }

      // Delete standalone CSS files
      for (const cssFile of cssFiles) {
        delete bundle[cssFile];
      }
    },
  };
}

export default defineConfig(({ command }) => {
  const shouldVisualize =
    process.env.VITE_BUNDLE_VISUALIZE === 'true' &&
    command === 'build';

  const plugins: Plugin[] = [
    react(),
    inlineCss(),
  ];

  if (shouldVisualize) {
    plugins.push(
      visualizer({
        filename: 'dist/stats.json',
        template: 'raw-data',
        open: false,
        gzipSize: false,
        title: 'Bundle Visualizer',
        brotliSize: false,
      }) as any
    );
  }

  return {
    base: './',

    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),
        '@/middleware/interface': path.resolve(import.meta.dirname, 'src/middleware/interface'),
      },
    },

    plugins,

    server: {
      watch: {
        ignored: [
          '**/thumbnails/**',
          '**/Takeout/**',
          '**/sprites/**',
        ],
      },
    },

    build: {
      chunkSizeWarningLimit: 2000,
      sourcemap: shouldVisualize,

      esbuild: {
        legalComments: 'none',
        drop: ['console', 'debugger'],
      },

      rolldownOptions: {
        output: shouldVisualize
          ? {
            chunkFileNames: (chunkInfo) => {
              if (chunkInfo.name.startsWith('vendor')) {
                return 'vendors/[name]-[hash].js';
              }

              return 'assets/[name]-[hash].js';
            },

            assetFileNames: 'assets/[name]-[hash][extname]',

            codeSplitting: {
              groups: [
                {
                  name(id) {
                    if (id.includes('node_modules')) {
                      if (id.includes('@Vercel')) {
                        return 'vendor-vercel';
                      }

                      if (id.includes('lucide-react')) {
                        return 'vendor-ux-lucide';
                      }

                      if (id.includes('driver.js')) {
                        return 'vendor-driver-js';
                      }

                      if (id.includes('uplot')) {
                        return 'vendor-ux-uplot';
                      }

                      if (id.includes('react-virtuoso')) {
                        return 'vendor-render-virtuoso';
                      }

                      if (id.includes('react-zoom-pan-pinch')) {
                        return 'vendor-ux-zoom-pan-pinch';
                      }

                      if (id.includes('react-intersection-observer')) {
                        return 'vendor-render-intersection-observer';
                      }

                      if (id.includes('leaflet')) {
                        return 'vendor-map-leaflet';
                      }

                      if (id.includes('localforage')) {
                        return 'vendor-storage-localforage';
                      }

                      if (id.includes('flexlayout-react')) {
                        return 'vendor-ux-flexlayout';
                      }

                      if (id.includes('@tanstack')) {
                        return 'vendor-render-tanstack';
                      }

                      if (id.includes('exifr')) {
                        return 'vendor-parse-exifr';
                      }

                      if (
                        id.includes('react-router') ||
                          id.includes('react-router-dom')
                      ) {
                        return 'vendor-render-router';
                      }

                      if (
                        id.includes('@mui') ||
                          id.includes('material-ui') ||
                          id.includes('@emotion')
                      ) {
                        return 'vendor-ux-mui';
                      }

                      if (
                        id.includes('react') ||
                          id.includes('react-dom')
                      ) {
                        return 'vendor-render-react';
                      }

                      return 'vendor';
                    }

                    return null;
                  },

                  test: (id) => id.includes('node_modules'),
                  priority: 10,
                  minShareCount: 0,
                },
              ],
            },
          }
          : {
            codeSplitting: false,
          },
      },
    },
  };
});
