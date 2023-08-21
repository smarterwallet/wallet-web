import React from 'react';
import './HeaderBar.css';
import { LeftOutlined } from '@ant-design/icons';

interface HeaderBarProps {
  text: string;
}

class HeaderBar extends React.Component<HeaderBarProps, {}> {
  render() {
    return (
      <div className="header-bar" onClick={()=> window.history.back()}>
        <img className="header-bar-icon" src="/icon/arrow-left.png" />
        {/*<LeftOutlined className="header-bar-icon" rev={undefined} />*/}

        <div className="header-bar-text">{this.props.text}</div>
      </div>
    );
  }
}

export default HeaderBar;
