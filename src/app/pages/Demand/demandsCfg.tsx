import { IconKey, IconProtect, IconPurse, IconTransferMoney, IconUsers } from '../Icons';
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownOutlined, ArrowUpOutlined, RightOutlined } from '@ant-design/icons';

const LoginRecovery = (
  <ul className="extra-content">
    <li>
      <div className="txt">
        Convenient login methods
      </div>
      <RightOutlined rev={undefined} />
    </li>
    <li>
      <div className="txt">
        Add Additional verification
      </div>
      <RightOutlined rev={undefined} />
    </li>
    <li>
      <div className="txt">
        Add recovery ways as backup
      </div>
      <RightOutlined rev={undefined} />
    </li>
  </ul>
);

const tradeToEarn = (
  <ul className="extra-content trade-to-earn-extra">
    <li>
      <Link to="/tradeToEarn/standard">
        <div className="front-icon"/>
        <div className="txt">
          Standard return: 4%~8%
        </div>
        <RightOutlined rev={undefined} />
      </Link>
    </li>
    <li>
      <Link to="/tradeToEarn/higher">
        <div className="front-icon">
          <ArrowUpOutlined rev={undefined} />
        </div>

        <div className="txt">
          Higher return and risks
        </div>
        <RightOutlined rev={undefined} />
      </Link>
    </li>
    <li>
      <Link to="/tradeToEarn/lower">
        <div className="front-icon">
          <ArrowDownOutlined rev={undefined} />
        </div>
        <div className="txt">
          Lower return and risks
        </div>
        <RightOutlined rev={undefined} />
      </Link>
    </li>
  </ul>
)

const demandsCategory = [
  {
    title: 'Manage your account',
    demands: [
      {
        icon: IconKey,
        opened: true,
        name: 'Login & Recovery',
        extra: LoginRecovery,
      },
      {
        icon: IconProtect,
        opened: false,
        name: 'Security & Privacy',
        extra: '',
      },
      {
        icon: IconUsers,
        opened: false,
        name: 'Authorize Others',
        extra: '',
      },
    ]
  },
  {
    title: 'Interact with others',
    demands: [
      {
        icon: IconPurse,
        opened: true,
        name: 'Trade to Earn',
        extra: tradeToEarn,
      },
      {
        icon: IconTransferMoney,
        opened: false,
        name: 'Transfer to Others',
        extra: '',
      },
    ]
  },
];

export default demandsCategory;