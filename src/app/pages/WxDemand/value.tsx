import React from 'react';

const Value = () => {
  return (
    <div className="value-content">
      <h2>Hotdog道具自动交易方案推荐</h2>
      <p className="main-txt"><strong>游戏道具：</strong>潮牌服饰    <strong>数量：</strong>10个 （50%）</p>
      <p className="main-txt"><strong>当前兑换比例：</strong>1 潮牌服饰 = 5 Hotdog （-5%）</p>
      <p className="main-txt"><strong>交易策略：</strong>游戏进攻+公会打金+市场交易</p>
      <p className="main-txt"> <strong>具体执行步骤：</strong></p>
      <div className="step-txt">1.自动搜寻并开启敌军武力值&lt;80%，健康值&lt;60%的游戏，主动发起进攻</div>
      <div className="step-txt">2.当净增资产&lt;=10时，自动选择并存入回报率最高的游戏公会，开启打金</div>
      <div className="step-txt">3.当资产兑换比例下跌/上涨超过10%的时候自动发起交易，全部买入/卖出</div>
      <p className="main-txt"><strong>预计回报率: </strong> 10%~15%</p>

    </div>
  );
};

export default Value;