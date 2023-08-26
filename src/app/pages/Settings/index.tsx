import HeaderBar from "../../elements/HeaderBar";
import React, { useState } from "react";
import { Button, Checkbox, Col, Collapse, Form, Input, Row, Space } from 'antd';
import {
  CheckOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone, LineOutlined,
  SyncOutlined,
  UndoOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './styles.scss'

export default () => {

  const [editUsername, setEditUsername] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="ww-page-container setting-page">
      <HeaderBar text='Settings'/>
      <Collapse
        defaultActiveKey="1"
        className="ww-collapse"
        accordion
        items={[
          {
            label: 'My account info',
            key: '1',
            children: (<Form>
              <Form.Item
                label="Username"
              >
                <Row>
                  <Col span={22}>
                    <Input value="Smart AA"/>
                  </Col>
                  <Col span={2} className="icon-wrapper">
                    {
                      editUsername ?
                        <CheckOutlined onClick={() => setEditUsername(false)} rev={undefined}/>
                        :
                        <EditOutlined onClick={() => setEditUsername(true)} rev={undefined} />
                    }
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item
                label="Password for local device"
              >
                <Row>
                  <Col span={22}>
                    <Input.Password/>
                  </Col>
                  <Col span={2} className="icon-wrapper">
                    {
                      editPassword ?
                        <CheckOutlined onClick={() => setEditPassword(false)} rev={undefined}/>
                        :
                        <EditOutlined onClick={() => setEditPassword(true)} rev={undefined} />
                    }
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item
                label="Email for third-party storage"
              >
                <Row>
                  <Col span={22}>
                    <Input value="smartaa@gmail.com"/>
                  </Col>
                  <Col span={2} className="icon-wrapper">
                    {
                      editEmail ?
                        <CheckOutlined onClick={() => setEditEmail(false)} rev={undefined}/>
                        :
                        <EditOutlined onClick={() => setEditEmail(true)} rev={undefined} />
                    }
                  </Col>
                </Row>
              </Form.Item>
            </Form>)
          },
          {
            label: 'My login keys',
            key: '2',
            children: (<div className="login-keys">
              <Row>
                <Col span={22}>My local device</Col>
                <Col span={1}>
                  <Checkbox/>
                </Col>
              </Row>
              <Row>
                <Col span={22}>Smart AA wallet server</Col>
                <Col span={1}><Checkbox/></Col>
              </Row>
              <Row>
                <Col span={22}>Distributed storage (IPFS)</Col>
                <Col span={1}><Checkbox/></Col>
              </Row>

              <Space style={{ width: '100%', marginTop: '20px', justifyContent: 'center' }}>
                <Button>Upgrade <SyncOutlined rev={undefined} /></Button>
                <Button>Delete <LineOutlined rev={undefined} /></Button>
              </Space>
            </div>)
          },
        ]}
      />
    </div>
  )
}
