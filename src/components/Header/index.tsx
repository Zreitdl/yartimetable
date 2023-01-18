import Logout from "../auth/Logout";
import { auth } from "../../config/firebase";

import cn from "classnames";

import style from "./_.module.scss";

const Header = (className: { className: string }) => {
  return (
    <div className={cn(style.headerContainer, className)}>
      <div className={style.leftLinks}>
      </div>
      <div className={style.rightLinks}>
        {auth.currentUser && (
          <>
            <div>{auth.currentUser?.email}</div>
            <Logout />
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
