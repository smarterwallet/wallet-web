import './style.scss'; 

interface SignupPara {
  text: string,
  iconPath: string
}

const SignupTab = (props: SignupPara) => {
  return (
    <div className='tabs'>
      <img src={props.iconPath} className='userIcon'/>
      <div>{props.text}</div>
    </div>
  )
}

export default SignupTab;