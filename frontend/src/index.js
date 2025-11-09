import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { SocketProvider } from './contexts/SocketContext';
import { ToastProvider } from './contexts/ToastContext';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </SocketProvider>
    </Provider>
  </React.StrictMode>
);
