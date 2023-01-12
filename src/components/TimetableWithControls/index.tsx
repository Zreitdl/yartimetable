import { auth } from "../../config/firebase";

import style from "./_.module.scss";
import cn from "classnames";

interface Props {}

const TimetableWithControls = () => {
  const defaultHourSegment = 1;
  let defaultDayHours = [];
  for (let i = 0; i < 24; i += defaultHourSegment) {
    defaultDayHours.push(i);
  }

  return (
    <>
      <div className="controls"></div>
      <div className={style.week}>
        <div className={cn(style.dayCol, style.dayHeader)}>
          {defaultDayHours.map((hour) => (
            <div className={style.hourSegment}>
              {Math.trunc(hour) + ":" + (60 * (hour - Math.trunc(hour)) < 10 ? "0" + 60 * (hour - Math.trunc(hour)) : 60 * (hour - Math.trunc(hour)))}
            </div>
          ))}
        </div>
        <div className={style.dayCol}>
          {defaultDayHours.map((hour) => (
            <div className={style.hourSegment}></div>
          ))}
        </div>
        <div className={style.dayCol}>
          {defaultDayHours.map((hour) => (
            <div className={style.hourSegment}></div>
          ))}
        </div>
        <div className={style.dayCol}>
          {defaultDayHours.map((hour) => (
            <div className={style.hourSegment}></div>
          ))}
        </div>
        <div className={style.dayCol}>
          {defaultDayHours.map((hour) => (
            <div className={style.hourSegment}></div>
          ))}
        </div>
        <div className={style.dayCol}>
          {defaultDayHours.map((hour) => (
            <div className={style.hourSegment}></div>
          ))}
        </div>
        <div className={style.dayCol}>
          {defaultDayHours.map((hour) => (
            <div className={style.hourSegment}></div>
          ))}
        </div>
        <div className={style.dayCol}>
          {defaultDayHours.map((hour) => (
            <div className={style.hourSegment}></div>
          ))}
        </div>
      </div>
      <div className="controls2"></div>
    </>
  );
};

export default TimetableWithControls;
