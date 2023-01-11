import React from "react";
import Header from "../Header";

import style from "./_.module.scss";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
    <Header />
    <div className={style.container}>
      <div className={style.content}>{children}</div>
    </div>
    </>
  );
};

export default Layout;
