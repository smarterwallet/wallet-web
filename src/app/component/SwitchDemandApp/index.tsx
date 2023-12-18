import React from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './styles.scss';

interface IProps {
  to: string;
}

const SwitchDemandApp = ({ to }: IProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="switch-demand-app"
      onClick={() => {
        navigate(to);
        localStorage.setItem('wwNavType', to);
      }}
    >
      <AppstoreOutlined rev={undefined} />
    </div>
  );
};

export default SwitchDemandApp;