import React from 'react';
import { IconArrowDown } from '../Icons';

const Verify = () => {
  return (
    <div className="verify-content">
      <h2>推荐适合您的最佳登录方式</h2>
      <p className="main-txt">基于您的账户存有大额资产，推荐双重验证：</p>
      <div className="verify-step">
        <p className="txt">1.输入 <strong> 密码</strong>进行 <strong>本地验证</strong></p>
        <strong className="or">OR</strong>
        <p className="txt">1.MPC进行 <strong>多方认证</strong></p>
      </div>
      <div className="arrow-down">
        {IconArrowDown}
      </div>
      <div className="verify-step">
        <p className="txt">2.用Amazon Pinpoint 通过短信 <strong>验证手机号</strong></p>
        <strong className="or">OR</strong>
        <p className="txt">2.用Amazon Cognito 通过邮件 <strong>验证邮箱</strong></p>
      </div>


      <p className="main-txt">当进行大额资产转移，推荐额外验证：</p>
      <div className="verify-step2">
        <div className="txt">当转账金额&gt;=$10k</div>
        <div className="arrow-down">
          {IconArrowDown}
        </div>
        <div className="txt">用Amazon Rekognition进行 <strong>人脸识别验证</strong></div>
      </div>

      <p className="main-txt">无法正常验证登录时，推荐添加账号恢复：</p>
      <div className="verify-step2">
        <div className="txt">当无法通过双重验证</div>
        <div className="arrow-down">
          {IconArrowDown}
        </div>
        <div className="txt">用Amazon Connect Voice ID进行 <strong>语音认证</strong></div>
      </div>
    </div>
  );
};

export default Verify;