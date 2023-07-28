import SWCell from "../../component/SWCell"
import HeaderBar from "../../elements/HeaderBar"

export default function RegisterAccountTypePage(props: {}) {
  return (
    <div className="register-page">
      <HeaderBar text="Account Signup" />
      <div>Choose the type of account you want to have:</div>

      <div className="register-page-title">Choose a way to register your account:</div>

      <SWCell icon="/icon/lock.png" text="Single party account" to="/registerPwd" shadow={true} />

      <SWCell icon="/icon/lock.png" text="Multi party account" to="/registerPwd" shadow={true} />
    </div>
  )
}
