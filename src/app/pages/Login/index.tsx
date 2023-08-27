import HeaderBar from "../../elements/HeaderBar";
import React from "react";
import { Button, Collapse, Form, Input, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Global } from '../../../server/Global';
import './styles.scss';

export default () => {

  const navigate = useNavigate();

  const login = async (values: any) => {
    message.info('Login...');
    let smarterWalletKey = localStorage.getItem('smarter-wallet-key');
    let loginkey = localStorage.getItem('loginkey');

    let str = values.password + smarterWalletKey;
    let tryLogin = window.btoa(str); // encrypt

    if (tryLogin === loginkey) {
      let key = window.atob(smarterWalletKey);
      key = key.substring(values.password.length, key.length);
      await Global.changeAccountType(1);
      await Global.account.initAccount(key);
      Global.account.isLoggedIn = true;

      navigate('/home')
    } else {
      message.error('Password incorrect');
    }
  }

  const mpcLogin = async (values: any) => {
    message.info('MPC Login...');
    let smarterWalletKey = localStorage.getItem('smarter-wallet-key');
    let loginkey = localStorage.getItem('loginkey');

    let str = values.password + smarterWalletKey;
    let tryLogin = window.btoa(str); // encrypt

    if (tryLogin === loginkey) {
      // TODO only for test
      let mpcKey = "{\"Id\":1,\"ShareI\":217846336608636814869730242691162623428602750849327859885486059440886707396967,\"PublicKey\":{\"Curve\":\"secp256k1\",\"X\":21813151983507503395302029099618182021145901011013099920572583206125558516758,\"Y\":49671425612481876155282918131354433515159845133152098589877317033648352777306},\"ChainCode\":\"8700298ba02dc4399722ee5780b6c8941f6031de3788b6bd69d529e9ec5d25de\",\"SharePubKeyMap\":{\"1\":{\"Curve\":\"secp256k1\",\"X\":72028570987944934025156373151523167380442519718362391580784617155013272187769,\"Y\":93688287248850657301208517895383787722033271638455717634452870193797992290602},\"2\":{\"Curve\":\"secp256k1\",\"X\":60843502703945476734713204655662180964958429379404842990456662320579017070952,\"Y\":87483069748555958504231705641021186473714992537449899429345728572632959317890},\"3\":{\"Curve\":\"secp256k1\",\"X\":46261205405204336553406740356964276639162145646919877661047679199346115145801,\"Y\":110010455857167350971875975047238195426068498783803218741316697224349730843919}}}";
      await Global.changeAccountType(2);
      await Global.account.initAccount(mpcKey);
      Global.account.isLoggedIn = true;

      navigate('/home');
    } else {
      message.error('Password incorrect');
    }
  }


  return (
    <div className="ww-page-container">
      <HeaderBar text='Login' />
      <Collapse
        defaultActiveKey="1"
        className="ww-collapse"
        accordion
        items={[
          {
            label: 'Local login',
            key: '1',
            children: (<Form onFinish={login}>
              <Form.Item
                label="Password"
                name="password"
              >
                <Input.Password />
              </Form.Item>
              <Button
                // type="primary"
                htmlType="submit"
                style={{ width: '100%' }}
              >Login</Button>
            </Form>)
          },
          {
            label: 'Multi-party Login',
            key: '2',
            children: (<Form className="ww-multi-party-form" onFinish={mpcLogin}>
              <Form.Item
                label="Password"
                name="password"
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Email"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Code"
              >
                <Space>
                  <Input />
                  <Button className="ww-mini-btn">Send Code</Button>
                </Space>
              </Form.Item>
              <Button
                // type="primary"
                htmlType="submit"
                style={{ width: '100%' }}
              >Login</Button>
            </Form>)
          },
        ]}
      />
    </div>
  )
}
