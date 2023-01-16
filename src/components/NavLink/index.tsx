import React from "react";
import cn from "classnames";

import style from "./_.module.scss";
import { NavLink as NavigationLink } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  to: string;
}

const NavLink = ({ children, to }: Props) => {
  return (
    <NavigationLink
      className={({ isActive }) => cn(style.link, { [style.active]: isActive })}
      to={to}
    >
      {children}
    </NavigationLink>
  );
};

export default NavLink;
