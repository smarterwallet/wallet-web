import React from 'react';
// @ts-ignore
import mapleLeafImg from './img/mapleLeaf.png'; // @ts-ignore
import nostrImg from './img/nostr.png'; // @ts-ignore
import lensProtocolImg from './img/lensProtocol.png'; // @ts-ignore
import farcasterImg from './img/farcaster.png'; // @ts-ignore
import selectedImg from './img/selected.png';
import { Button } from 'antd';

const ConfirmRight = () => {
  return (
    <div className="confirm-right">
      <h2>1. Qtum的AIGC内容链上确权</h2>
      <div className="img-content">
        <p>树叶都红了，枫叶落下了，秋天真的来了！</p>
        <img src={mapleLeafImg} alt=""/>
      </div>
      <h2>2. 同步到您的其他社媒账号</h2>
      <ul className="media-list">
        <li>
          <img src={nostrImg} alt="" className="media-icon"/>
          <div className="media-name">Nostr</div>
          <img src={selectedImg} alt="" className="selected"/>
        </li>
        <li>
          <img src={lensProtocolImg} alt="" className="media-icon"/>
          <div className="media-name">Lens Protocol</div>
          <img src={selectedImg} alt="" className="selected"/>
        </li>
        <li>
          <img src={farcasterImg} alt="" className="media-icon"/>
          <div className="media-name">Farcaster</div>
          <img src={selectedImg} alt="" className="selected"/>
        </li>
      </ul>
      <h2>3. 自动检测和维护链上版权</h2>


    </div>
  );
};

export default ConfirmRight;