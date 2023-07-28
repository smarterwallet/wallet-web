import { NavLink } from "react-router-dom"

export default function SWCell({
  icon,
  text,
  to,
  shadow = false,
}: {
  icon: string
  text: string
  to: string
  shadow?: boolean
}) {
  return (
    <NavLink className={`register-page-menu-container ${shadow && "shadow"}`} to={to}>
      <img className="register-page-menu-icon" src={icon} />
      <div className="register-page-menu-text">{text}</div>
      <img className="register-page-menu-arrow" src="/icon/arrow-right.png" />
    </NavLink>
  )
}
