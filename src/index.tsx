import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import AppComponent from './app/App';
import './index.css';
import './styles/common.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#0A3D53',
      },
    }}
    >
    <AppComponent />
  </ConfigProvider>
);
