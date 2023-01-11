import React from "react";

import style from "./_.module.scss";

interface Props {
  children: React.ReactNode;
}

const Button = ({ children }: Props) => {
  return (
    <div className={style.container}>
      <div className={style.content}>{children}</div>
    </div>
  );
};

export default Button;
