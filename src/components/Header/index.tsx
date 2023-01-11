import Logout from "../auth/Logout";
import { auth } from "../../config/firebase";

import style from "./_.module.scss";

interface Props {}

const Header = () => {
  return (
    <div className={style.headerContainer}>
      <div className="logo">
        YarTimetable
      </div>
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
