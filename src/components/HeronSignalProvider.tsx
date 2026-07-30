'use client';

import { useEffect } from 'react';
import { initHeronSignal, event as heronEvent, captureError as heronCaptureError, log as heronLog } from '@heronsignal/web';

export interface HeronSignalProviderProps {
  publicKey?: string;
}

export default function HeronSignalProvider({ publicKey }: HeronSignalProviderProps) {
  const key = publicKey || process.env.NEXT_PUBLIC_HERONSIGNAL_PUBLIC_KEY;

  useEffect(() => {
    if (!key) return;

    try {
      void initHeronSignal({
        publicKey: key,
        captureConsole: true,
        captureNetworkFailures: true,
        captureRuntimeErrors: true,
      });
      console.log('✓ HeronSignal Real-User Monitoring initialized');
    } catch (err) {
      console.error('Failed to initialize HeronSignal:', err);
    }
  }, [key]);

  return null;
}

// Utility exports for custom business events & error logging
export function trackHeronEvent(name: string, payload?: Record<string, unknown>) {
  try {
    heronEvent(name, payload as Parameters<typeof heronEvent>[1]);
  } catch {
    // fallback if SDK not active
  }
}

export function logHeronWarning(message: string, payload?: Record<string, unknown>) {
  try {
    heronLog('warn', message, payload as Parameters<typeof heronLog>[2]);
  } catch {
    // fallback
  }
}

export function captureHeronException(error: unknown) {
  try {
    if (error instanceof Error) {
      heronCaptureError(error);
    } else {
      heronLog('error', String(error));
    }
  } catch {
    // fallback
  }
}
