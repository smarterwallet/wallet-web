import React from 'react';
import './styles.scss'
import { AppstoreOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

// @ts-ignore
import mapleLeafImg from './img/mapleLeaf.png'; // @ts-ignore
import nostrImg from './img/nostr.png'; // @ts-ignore
import lensProtocolImg from './img/lensProtocol.png'; // @ts-ignore
import farcasterImg from './img/farcaster.png'; // @ts-ignore
import selectedImg from './img/selected.png';
import { Button, Input, message } from 'antd';
import { IconMicrophone } from '../Icons';
import ConfirmRight from './confirmRight';
import Value from './value';
import Verify from './verify';
import HeaderBar from '../../elements/HeaderBar';

const WxDemandItem = () => {
  const params = useParams();
  const navigator = useNavigate();

  const { category = 'confirmRight' } = params;
  const inputDemand = (e: any) => {
    const value = e.target.value as string;
    if (value.includes('确权')) {
      go('confirmRight')
    } else if (value.includes('增值')) {
      go('value')
    } else if (value.includes('验证')) {
      go('verify')
    }
  }

  const go = (category: string) => {
    navigator('/wxDemandItem/' + category);
  }

  return (
    <div className="ww-page-container page-wx-demand">
      <HeaderBar text="需求抽象"/>
      <AppstoreOutlined className="app-store-icon" rev={undefined} />
      <div className="demand-content">
        {
          category === 'confirmRight' && <ConfirmRight/>
        }
        {
          category === 'value' && <Value/>
        }
        {
          category === 'verify' && <Verify/>
        }

        <div className="btn-wrap">
          <Button>修改</Button>
          <Button onClick={() => {
            message.loading('执行中...').then(() => {
              message.success('执行成功');
            });
          }}>确认执行</Button>
        </div>
      </div>

      <div className="empty-flex"/>

      <div className="other-demand">
        <div className="txt">
          <Input type="text" placeholder="输入您想要知道或得到的..." onKeyDown={inputDemand}/>
        </div>
        <div className="icon-wrap">
          {IconMicrophone}
        </div>
      </div>
    </div>
  );
};

export default WxDemandItem;