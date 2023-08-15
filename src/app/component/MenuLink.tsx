import React from 'react';
import { RightOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

interface IProps {
  to: string;
  children: string;
}

const MenuLink = (props: IProps) => {
  return (
    <NavLink className="ww-menu" to={props.to}>
      <div className="ww-menu-text">
        {props.children}
      </div>
      <RightOutlined rev={undefined} />
    </NavLink>
  );
};

export default MenuLink;