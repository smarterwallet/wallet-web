import { NavLink } from 'react-router-dom';
import './SWCell.scss';

export default function SWCell({
  icon,
  text,
  to,
  shadow = false,
}: {
  icon?: string;
  text: string;
  to: string;
  shadow?: boolean;
}) {
  return (
    <NavLink
      className={`flex flex-row items-center justify-center p-[15px] no-underline ${
        shadow && 'bg-[#D9D9D9] shadow-lg rounded-full'
      }`}
      to={to}
    >
      {icon && <img className="w-[30px] h-[30px]" src={icon} />}

      <div className="grow px-2 text-[20px] text-black font-semibold">{text}</div>
      <img className="w-[20px] h-[20px]" src="/icon/arrow-right.png" />
    </NavLink>
  );
}
