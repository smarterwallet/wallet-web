import HeaderBar from '../../../elements/HeaderBar';
import React from 'react';
import { Button, Collapse, Space } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function SinglePartyAccountPage(props: {}) {

  const navigate = useNavigate();

  return (
    <div className="ww-page-container">
      <HeaderBar text="Single Party Account" />

      <div>
        <Collapse
          accordion
          className="ww-collapse"
          defaultActiveKey="Single-party"
          items={[
            {
              label: 'Single-party account',
              key: 'Single-party',
              children: (
                <>
                  <div>
                    <Space>
                      <CheckCircleTwoTone twoToneColor="#52c41a" />
                      <h3>Register successfully</h3>
                    </Space>
                  </div>
                  <Button type="primary" style={{ width: '100%'}}>Login</Button>
                </>
              )
            },
            {
              label: 'Multi-party account account',
              key: 'Multi-party',
              children: (
                <>
                  <p style={{ marginBottom: '1em'}}>
                    Two other keys will be stored in the wallet server and IPFS.
                  </p>
                  <Button
                    type="primary"
                    style={{ width: '100%'}}
                    onClick={() => {
                      navigate('/multiPartyAccount')
                    }}
                  >Register</Button>
                </>
              )
            }
          ]}
        />
      </div>
    </div>
  );
}
