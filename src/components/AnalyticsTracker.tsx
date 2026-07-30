'use client';

import { useEffect } from 'react';

export default function AnalyticsTracker() {
  useEffect(() => {
    // Session-throttled tracking so refreshing a page within same tab session doesn't inflate counts
    const hasTracked = sessionStorage.getItem('rkz_visit_tracked');
    if (!hasTracked) {
      fetch('/api/public/track-visit', { method: 'POST' })
        .then(() => {
          sessionStorage.setItem('rkz_visit_tracked', 'true');
        })
        .catch(() => {});
    }
  }, []);

  return null;
}
