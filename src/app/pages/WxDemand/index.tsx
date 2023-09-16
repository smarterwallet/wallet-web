import React from 'react';
import { AppstoreOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

// @ts-ignore
import userImg from './img/users.png'; // @ts-ignore
import flyImg from './img/fly.png'; // @ts-ignore
import lifeImg from './img/life.png'; // @ts-ignore
import scanImg from './img/scan.png'; // @ts-ignore
import shoppingImg from './img/shopping.png';// @ts-ignore
import studyImg from './img/study.png';// @ts-ignore
import videoImg from './img/video.png';// @ts-ignore
import workImg from './img/work.png';// @ts-ignore
import busImg from './img/bus.png';


import './styles.scss';
import { Input, message } from 'antd';
import { IconMicrophone } from '../Icons';
import HeaderBar from '../../elements/HeaderBar';

const WxDemand = () => {

  const navigator = useNavigate();
  
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
    message.loading('执行中...');
    setTimeout(() => {
      navigator('/wxDemandItem/' + category);
    }, 3000)
  }
  
  return (
    <div className="ww-page-container page-wx-demand">
      <HeaderBar text="需求抽象" returnable={false}/>
      <AppstoreOutlined className="app-store-icon" rev={undefined} />

      <ul className="demand-content">
        <li onClick={() => go('confirmRight')}>
          <div className="category-img">
            <img src={userImg} alt=""/>
          </div>
          <div className="content">
            <div className="title">社媒内容同步更新确权</div>
            <div className="intro">将您在Qtum生成的AIGC内容同步到您的其他社交媒体上并确权</div>
          </div>
          <div className="arrow"><RightOutlined rev={undefined} /></div>
        </li>
        <li onClick={() => go('value')}>
          <div className="category-img">
            <img src={flyImg} alt=""/>
          </div>
          <div className="content">
            <div className="title">游戏道具自动增值方案</div>
            <div className="intro">生成并运行最佳的自动交易策略，为您的Hotdog游戏道具资产增值</div>
          </div>
          <div className="arrow"><RightOutlined rev={undefined} /></div>
        </li>
        <li onClick={() => go('verify')}>
          <div className="category-img">
            <img src={scanImg} alt=""/>
          </div>
          <div className="content">
            <div className="title">适合您的安全便捷登录方式</div>
            <div className="intro">推荐最佳的安全登录验证服务，链上加密存储和验证个人身份数据</div>
          </div>
          <div className="arrow"><RightOutlined rev={undefined} /></div>
        </li>
      </ul>

      <ul className="other-list">
        <li>
          <div className="img-wrap"><img src={shoppingImg} alt=""/></div>
          <div className="title">购物</div>
        </li>
        <li>
          <div className="img-wrap"><img src={studyImg} alt=""/></div>
          <div className="title">学习</div>
        </li>
        <li>
          <div className="img-wrap"><img src={videoImg} alt=""/></div>
          <div className="title">娱乐</div>
        </li>
        <li>
          <div className="img-wrap"><img src={busImg} alt=""/></div>
          <div className="title">出行</div>
        </li>
        <li>
          <div className="img-wrap"><img src={lifeImg} alt=""/></div>
          <div className="title">生活</div>
        </li>
        <li>
          <div className="img-wrap"><img src={workImg} alt=""/></div>
          <div className="title">工作</div>
        </li>
      </ul>

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

export default WxDemand;