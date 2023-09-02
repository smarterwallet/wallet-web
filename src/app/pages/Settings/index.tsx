import HeaderBar from "../../elements/HeaderBar";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button, Checkbox, Col, Collapse, Form, Input, Row, Space, message, Modal } from 'antd';
import {
  CheckOutlined,
  EditOutlined,
  MinusCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './styles.scss'
import { Global } from "../../../server/Global";

export default () => {

  const [editUsername, setEditUsername] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const upgrade = async (values: any) => {
    message.info("Comming soon");
  }

  const showModalDeleteKeys = () => {
    setIsModalOpen(true);
  };

  const handleDeleteKey = () => {
    deleteAllKeys();
    setIsModalOpen(false);
    message.info("Delete all keys success");
  };

  const handleCancelDeleteKey = () => {
    setIsModalOpen(false);
    message.info("Cancel delete keys");
  };


  const deleteAllKeys = () => {
    if (!Global.account.existLocalStorageKey()) {
      message.error("Already delete keys");
      return;
    }
    Global.account.deleteKeyFromLocalStorage();
    Global.account.isLoggedIn = false;
    return <Navigate to="/" replace />;
  }

  if (!Global.account.isLoggedIn) {
    message.error("Please sign in first");
    return <Navigate to="/" replace />;
  }

  return (
    <div className="ww-page-container setting-page">
      <HeaderBar text='Settings' />
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
                    <Input value="Smart AA" />
                  </Col>
                  <Col span={2} className="icon-wrapper">
                    {
                      editUsername ?
                        <CheckOutlined onClick={() => setEditUsername(false)} rev={undefined} />
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
                    <Input.Password />
                  </Col>
                  <Col span={2} className="icon-wrapper">
                    {
                      editPassword ?
                        <CheckOutlined onClick={() => setEditPassword(false)} rev={undefined} />
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
                    <Input value="smartaa@gmail.com" />
                  </Col>
                  <Col span={2} className="icon-wrapper">
                    {
                      editEmail ?
                        <CheckOutlined onClick={() => setEditEmail(false)} rev={undefined} />
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
                  <Checkbox defaultChecked disabled />
                </Col>
              </Row>
              {Global.accountType() == 2 &&
                <Row>
                  <Col span={22}>Smart AA wallet server</Col>
                  <Col span={1}><Checkbox defaultChecked disabled /></Col>
                </Row>
              }
              {/* <Row>
                <Col span={22}>Distributed storage (IPFS)</Col>
                <Col span={1}><Checkbox /></Col>
              </Row> */}

              <Space style={{ width: '100%', marginTop: '20px', justifyContent: 'center' }}>
                <Button onClick={upgrade}>Upgrade  <SyncOutlined rev={undefined} /></Button>
                <Button onClick={showModalDeleteKeys}>Delete <MinusCircleOutlined rev={undefined} /></Button>
              </Space>
              <Modal title="DELETE KEYS" open={isModalOpen} onOk={handleDeleteKey} onCancel={handleCancelDeleteKey}>
                <p>This is an irreversible operation and your assets will be lost after deletion.</p>
                <p>Please confirm whether to continue?</p>
              </Modal>
            </div>)
          },
        ]}
      />
    </div>
  )
}
