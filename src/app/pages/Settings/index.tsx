import HeaderBar from "../../elements/HeaderBar";
import React, { useState } from "react";
import { Button, Col, Collapse, Form, Input, Row, Space } from 'antd';
import MenuLink from '../../component/MenuLink';
import { CheckOutlined, EditOutlined, EyeInvisibleOutlined, EyeTwoTone, UndoOutlined } from '@ant-design/icons';
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
                        <CheckOutlined onClick={() => setEditUsername(false) }/>
                        :
                        <EditOutlined onClick={() => setEditUsername(true) } />
                    }
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item
                label="Email"
              >
                <Row>
                  <Col span={22}>
                    <Input value="smartaa@gmail.com"/>
                  </Col>
                  <Col span={2} className="icon-wrapper">
                    {
                      editEmail ?
                        <CheckOutlined onClick={() => setEditEmail(false) }/>
                        :
                        <EditOutlined onClick={() => setEditEmail(true) } />
                    }
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item
                label="Password"
              >
                <Row>
                  <Col span={22}>
                    <Input.Password/>
                  </Col>
                  <Col span={2} className="icon-wrapper">
                    {
                      editPassword ?
                        <CheckOutlined onClick={() => setEditPassword(false) }/>
                        :
                        <EditOutlined onClick={() => setEditPassword(true) } />
                    }
                  </Col>
                </Row>
              </Form.Item>

            </Form>)
          },
          {
            label: 'My login keys',
            key: '2',
            children: (<>
              <Row>
                <Col span={12}>Local storage: </Col>
                <Col span={11}>ekf435dx...</Col>
                <Col span={1}><UndoOutlined /></Col>
              </Row>
              <Row>
                <Col span={12}>Wallet server: </Col>
                <Col span={11}>ekf435dx...</Col>
                <Col span={1}><UndoOutlined /></Col>
              </Row>
              <Row>
                <Col span={12}>IPFS: </Col>
                <Col span={11}>ekf435dx...</Col>
                <Col span={1}><UndoOutlined /></Col>
              </Row>

              <Space style={{ width: '100%', marginTop: '20px', justifyContent: 'center' }}>
                <Button>Delete -</Button>
                <Button>Add +</Button>
              </Space>
            </>)
          },
        ]}
      />
    </div>
  )
}
