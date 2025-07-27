import './index.css';
import '@ant-design/v5-patch-for-react-19';

import { ConfigProvider } from 'antd';
import enUS from 'antd/es/locale/en_US';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App.tsx';

createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <ConfigProvider locale={enUS}>
      <App />
    </ConfigProvider>
  </StrictMode>
);
