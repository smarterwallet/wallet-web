import SWCell from '../../component/SWCell';
import HeaderBar from '../../elements/HeaderBar';

export default function RegisterAccountTypePage(props: {}) {
  return (
    <div className="register-page">
      <HeaderBar text="Account Signup" />
      <div>Choose the type of account you want to have:</div>

      <div className="mt-16">
        <SWCell icon="/icon/lock.png" text="Single party account" to="/registerPwd" shadow={true} />
      </div>

      <div className="mt-8">
        <SWCell icon="/icon/lock.png" text="Multi party account" to="/registerPwd" shadow={true} />
      </div>
    </div>
  );
}
