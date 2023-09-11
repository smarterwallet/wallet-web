import React from 'react';
import './HeaderBar.css';
import { LeftOutlined } from '@ant-design/icons';

interface HeaderBarProps {
  text: string;
  returnable?: boolean;
}

const HeaderBar = (props: HeaderBarProps) => {
  const { text, returnable = true } = props;
  return (
    <div className="header-bar" onClick={()=> window.history.back()}>
      {
        returnable && (
          <img className="header-bar-icon" src="/icon/arrow-left.png" />
        )
      }

      <div className="header-bar-text">{text}</div>
    </div>
  );
}

export default HeaderBar;
