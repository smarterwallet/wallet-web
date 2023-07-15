import React from 'react';
import './RegisterPwdPage.css';
import { NavLink } from 'react-router-dom';
import HeaderBar from '../elements/HeaderBar';

class RegisterPwdPage extends React.Component {

  renderMenu(icon: string, text: string, to: string, shadow?: boolean) {
    return (
      <NavLink className={`register-page-menu-container ${shadow && 'shadow'}`} to={to}>
        <img className="register-page-menu-icon" src={icon} />
        <div className="register-page-menu-text">{text}</div>
        <img className="register-page-menu-arrow" src="/icon/arrow-right.png" />
      </NavLink>
    );
  }

  render() {
    return (
      <div className="register-page">
        <HeaderBar text='Password' />

        <div className="register-page-title">
          Choose an account register application:
        </div>

          {this.renderMenu('/icon/device.png', 'Local Device', '/createAccount', true)}

        <div className="register-page-title small">
          Will support in the next version:
        </div>

        <div>
          {this.renderMenu('/icon/phone.png', 'Decentralized Storage (IPFS)','')}
          {this.renderMenu('/icon/cloud.png', 'Cloud Drive', '')}
          {this.renderMenu('/icon/others.png', 'Others', '')}
        </div>
      </div>
    );
  }
}

export default RegisterPwdPage;