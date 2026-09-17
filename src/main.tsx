import { setSettingsStore } from '@/context/settingsStore';
import '@/lib/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ReactFlowProvider } from '@xyflow/react';
import 'leaflet/dist/leaflet.css';
import { createRoot, Root } from 'react-dom/client';
import AppProviders from './context/AppProviders';

import AiLoadingBar from '@/components/AiLoadingBar';
import MainDriver from '@/components/tutorial/MainDriver';
import { PipelineTrashProvider } from '@/pipeline/PipelineTrashProvider';
import ReactFlowWrapper from '@/pipeline/ReactFlowWrapper';
import Toolbars from '@/toolbars';
import WebMCP from '@/webmcp';
import Windows from '@/windows';
import "@xyflow/react/dist/style.css";
import "driver.js/dist/driver.css";
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
      <ReactFlowProvider>
        <PipelineTrashProvider>
          <ReactFlowWrapper />
          <MainDriver />
          <AiLoadingBar />
          <Windows />
          <Toolbars />
          <WebMCP />
        </PipelineTrashProvider>
      </ReactFlowProvider>
    </AppProviders>
  </QueryClientProvider>,
)

if (import.meta.env.PROD && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
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

      wb.register({ updateViaCache: 'none' }).then((registration) => {
        // Check for a freshly deployed worker immediately, even when the app was already open.
        return registration?.update();
      }).catch((err) => {
        console.warn('SW update check failed', err);
      });
    } catch (err) {
      console.warn('SW registration failed', err);
    }
  }).catch(() => {
    // dynamic import failed - skip
  });
}
