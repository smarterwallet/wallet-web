import React from 'react';
import './HeaderBar.css';

interface HeaderBarProps {
  text: string;
}

class HeaderBar extends React.Component<HeaderBarProps, {}> {
  render() {
    return (
      <div className="header-bar" onClick={()=> window.history.back()}>
        <img className="header-bar-icon" src="/icon/arrow-left.png" />
        <div className="header-bar-text">{this.props.text}</div>
      </div>
    );
  }
}

export default HeaderBar;
