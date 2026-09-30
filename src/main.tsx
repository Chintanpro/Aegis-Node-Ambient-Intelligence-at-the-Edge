// Defensive fetch setter to support iframe proxy wrappers that assign to window.fetch
try {
  let _fetch = window.fetch;
  Object.defineProperty(window, 'fetch', {
    get() {
      return _fetch;
    },
    set(v) {
      _fetch = v;
    },
    configurable: true,
    enumerable: true,
  });
} catch (_) {}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
