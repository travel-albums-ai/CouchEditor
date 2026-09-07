import { debug } from '@/main';

type BenchmarkEntry = {
  file: string;
  durationMs: number;
  details?: string[];
};

const benchmarkBuffer: BenchmarkEntry[] = [];
const FLUSH_INTERVAL_MS = 2500;
let flushTimer: ReturnType<typeof setInterval> | null = null;

export const benchmarkFunction = <T>(fn: () => T, file: string, details?: string[]): T => {
  if (!debug) {
    return fn();
  }

  const t0 = performance.now();
  const result = fn();
  const durationMs = performance.now() - t0;

  benchmarkBuffer.push({ file, durationMs, details });
  startAutoFlush();

  return result;
};

export const benchmarkFunctionAsync = async <T>(fn: () => Promise<T>, file: string, details?: string[]): Promise<T> => {
  if (!debug) {
    return fn();
  }

  const t0 = performance.now();
  const result = await fn();
  const durationMs = performance.now() - t0;

  benchmarkBuffer.push({ file, durationMs, details });
  startAutoFlush();

  return result;
};

const startAutoFlush = () => {
  if (flushTimer !== null) return; // already running

  flushTimer = setInterval(() => {
    flushBenchmarks();
  }, FLUSH_INTERVAL_MS);
};

export const flushBenchmarks = (label = "✨ Benchmarks") => {
  if (benchmarkBuffer.length === 0) return;

  for (const { file, durationMs, details } of benchmarkBuffer) {
    const isFast = durationMs < 500;
    console.log(
      `%c${String(durationMs.toFixed(2)).padEnd(4)}ms%c - %c[${file}]%c - ${details ? `%c${details?.join(' | ')}` : ''}%c`,
      isFast ? 'color: #2be034; font-weight: 600;' : 'color: #ef4444; font-weight: 600;', // green or red label
      'color: inherit;',
      'color: #eaf63b; font-weight: 600;', // blue label
      'color: inherit;',
      'color: #6970d1; font-weight: 700;',  // red time
      'color: inherit;',
    );
  }

  benchmarkBuffer.length = 0;
};
