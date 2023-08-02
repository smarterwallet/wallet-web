import React from "react"
import "./RegisterPage.css"
import {NavLink} from "react-router-dom"
import HeaderBar from "../elements/HeaderBar"

class RegisterPage extends React.Component {
  renderMenu(icon: string, text: string, to: string, shadow?: boolean) {
    return (
      <NavLink className={`register-page-menu-container ${shadow && "shadow"}`} to={to}>
        <img className="register-page-menu-icon" src={icon} />
        <div className="register-page-menu-text">{text}</div>
        <img className="register-page-menu-arrow" src="/icon/arrow-right.png" />
      </NavLink>
    )
  }

  render() {
    return (
        <div className="register-page">
            <HeaderBar text="Welcome"/>

            <div className="register-page-title">Choose a way to register your account:</div>

            {/*<SWCell icon="/icon/lock.png" text="Password" to="/registerPwd" shadow={true} />*/}
            {this.renderMenu('/icon/lock.png', 'Password', '/registerPwd', true)}

            <div className="register-page-title small">Will support in the next version:</div>

            <div>
                {this.renderMenu("/icon/mail.png", "Email", "")}
                {this.renderMenu("/icon/sms.png", "SMS", "")}
                {this.renderMenu("/icon/phone.png", "Multi-device", "")}
                {this.renderMenu("/icon/social.png", "Social", "")}
            </div>
        </div>
    )
  }
}

export default RegisterPage;