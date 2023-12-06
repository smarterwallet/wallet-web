import { LeftOutlined } from '@ant-design/icons';
import { NavBar } from 'antd-mobile';
import React from 'react';

const BackBtn = () => {
  return (
    <NavBar
      onBack={() => window.history.back()}
      className="h-24"
      backArrow={
        <LeftOutlined rev={undefined} className="text-6xl font-semibold" style={{ color: 'rgba(13, 88, 112, 1)' }} />
      }
      back={
        <p className="text-5xl font-semibold pl-4" style={{ color: 'rgba(13, 88, 112, 1)' }}>
          Back
        </p>
      }
    />
  );
};

export default BackBtn;
