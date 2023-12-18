import HeaderBar from "../../elements/HeaderBar";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button, Checkbox, Col, Collapse, Form, Input, Row, Space, message, Modal } from 'antd';
import {
  ArrowUpOutlined,
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

  const [form] = Form.useForm();

  const [username, setUsername] = useState(localStorage.getItem('username') ?? '');
  const email = localStorage.getItem('email') ?? '';

  const navigate = useNavigate();
  const upgrade = async (values: any) => {
    message.info("Coming soon");
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

  const isMPC = Global.accountType() === 2;

  if (!Global.account.isLoggedIn) {
    message.error("Please login first");
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
            children: (<Form form={form}>
              <Form.Item
                label="Username"
              >
                <Row>
                  <Col span={22}>
                    <Input
                      value={username}
                      disabled={!editUsername}
                      placeholder="Please input username"
                      onChange={(e) => {
                        const value = e.target.value;
                        setUsername(value);
                      }}
                    />
                  </Col>
                  <Col span={2} className="icon-wrapper">
                    {
                      editUsername ?
                        <CheckOutlined
                          onClick={() => {
                            setEditUsername(false);
                            localStorage.setItem('username', username);
                            if (username) {
                              message.success('Setup successful!');
                            }
                          }}
                          rev={undefined}
                        />
                        :
                        <EditOutlined onClick={() => setEditUsername(true)} rev={undefined} />
                    }
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item
                label="Password for local device"
                name="password"
              >
                <Row>
                  <Col span={22}>
                    <Input.Password
                      disabled={!editPassword}
                      onChange={(e) => {

                      }}
                    />
                  </Col>
                  <Col span={2} className="icon-wrapper">
                    {
                      editPassword ?
                        <CheckOutlined
                          onClick={() => {
                            setEditPassword(false);
                            const password = form.getFieldValue('password');
                            if (password) {
                              Global.account.updateLocalKey(password);
                              message.success('Setup successful!');
                            }
                          }}
                          rev={undefined}
                        />
                        :
                        <EditOutlined onClick={() => setEditPassword(true)} rev={undefined} />
                    }
                  </Col>
                </Row>
              </Form.Item>
              {
                email != null && email != "" && <Form.Item
                  label="Email for third-party storage"
                >
                  <Row>
                    <Col span={22}>
                      <Input value={email} disabled />
                    </Col>
                    {/*<Col span={2} className="icon-wrapper">*/}
                    {/*  {*/}
                    {/*    editEmail ?*/}
                    {/*      <CheckOutlined onClick={() => setEditEmail(false)} rev={undefined} />*/}
                    {/*      :*/}
                    {/*      <EditOutlined onClick={() => setEditEmail(true)} rev={undefined} />*/}
                    {/*  }*/}
                    {/*</Col>*/}
                  </Row>
                </Form.Item>
              }
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

              <Space style={{ width: '100%', marginTop: '20px', justifyContent: 'center', gap: 20 }} className="btn-wrapper">
                {
                  isMPC ?
                    <Button onClick={upgrade} >Update  <SyncOutlined rev={undefined} /></Button>
                    :
                    <Button onClick={() => {
                      navigate('/signupAtMultiParty')
                    }}>Upgrade  <ArrowUpOutlined rev={undefined} /></Button>
                }
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
