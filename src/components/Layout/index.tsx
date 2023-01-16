import React from "react";
import Header from "../Header";
import NavLink from "../NavLink";

import style from "./_.module.scss";


interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <div className={style.container}>
        <div className={style.sideMenu}>
          <NavLink to="/">Timetable</NavLink>
          <NavLink to="/list">Timetable records</NavLink>
          <NavLink to="/activities">Activities</NavLink>
        </div>
        <div className={style.content}>{children}</div>
      </div>
    </>
  );
};

export default Layout;
