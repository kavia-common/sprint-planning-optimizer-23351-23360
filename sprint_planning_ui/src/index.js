import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles.css';
import App from './App';
import { ToastProvider } from './utils/toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ToastProvider>
    <App />
  </ToastProvider>
);
