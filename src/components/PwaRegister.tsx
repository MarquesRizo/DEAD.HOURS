'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[DEAD HOURS] Terminal PWA ativo. Escopo:', reg.scope);
          })
          .catch((err) => {
            console.warn('[DEAD HOURS] Falha no registro do Service Worker:', err);
          });
      });
    }
  }, []);

  return null;
}
