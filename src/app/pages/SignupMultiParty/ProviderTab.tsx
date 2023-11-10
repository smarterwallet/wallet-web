import './style.scss'; 

interface ProviderTabProp {
    iconPath?: string,
    text: string
}

const ProviderTab = (prop: ProviderTabProp) => {
  return (
    <div className="providerTabs">
      {prop.iconPath && <img src={prop.iconPath} />}  
      <div>{prop.text}</div>  
    </div>
  )
}

export default ProviderTab;