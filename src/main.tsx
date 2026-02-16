/**
 * @unit main.tsx -> Module
 * @purpose [AUTO] Module logic for main.tsx.
 * @dependencies [react, react-dom, @]
 * @complexity 2 (Low)
 * @scope [AUTO] Module-Local
 */
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nProvider } from '@/infrastructure/i18n';
import App from '@/presentation/App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
