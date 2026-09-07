import { setSettingsStore } from '@/context/settingsStore';
import AppLayout from '@/layout';
import '@/lib/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import 'leaflet/dist/leaflet.css';
import { createRoot, Root } from 'react-dom/client';
import AppProviders from './context/AppProviders';

import "driver.js/dist/driver.css";
import 'flexlayout-react/style/alpha_dark.css';
import 'flexlayout-react/style/combined.css';
import 'uplot/dist/uPlot.min.css';
import './freakflags.css';
import './index.css';

const queryClient = new QueryClient()
export const debug = true || process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true'

declare global {
  interface Window {
    __ROOT__?: Root;
  }
}

const container = document.getElementById('root') as HTMLElement;
const root = window.__ROOT__ ??= createRoot(container);

root.render(
  <QueryClientProvider client={queryClient}>
    <SpeedInsights />
    <Analytics />
    <AppProviders>
      <AppLayout />
    </AppProviders>
  </QueryClientProvider>,
)

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  import('workbox-window').then(({ Workbox }) => {
    try {
      const wb = new Workbox('/sw.js');
      try { (window as any).__WORKBOX = wb } catch {}

      wb.addEventListener('waiting', () => {
        try {
          setSettingsStore((prev: any) => ({ ...prev, newVersion: true }))
        } catch (e) {
          // ignore
        }
      });

      wb.addEventListener('controlling', () => {
        window.location.reload();
      });

      wb.register();
    } catch (err) {
      console.warn('SW registration failed', err);
    }
  }).catch(() => {
    // dynamic import failed - skip
  });
}
