import HeaderBar from "../../elements/HeaderBar";
import { Collapse } from 'antd';
import SignupTab from "../../component/SignUpPlayground/SignupTab";
import SignupMultiForm from "./SignupMultiForm";

const SignupMultiParty = () => {
  return (
    <div className='ww-page-container'>
      <HeaderBar text="Sign up" />
      <Collapse 
        className='ww-collapse'
        defaultActiveKey='1'
        items={[
          {
            label: (<SignupTab text="Email" iconPath="/icon/mail.png" />),
            key: '1',
            children: (<SignupMultiForm />),
          },            
        ]}
      />
    </div>
  )
}

export default SignupMultiParty