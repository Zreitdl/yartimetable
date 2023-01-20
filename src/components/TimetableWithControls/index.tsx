import style from "./_.module.scss";
import { Color, colorsWithHexValues } from "../../models/Color";
import { useEffect, useState } from "react";
import { TimetableRecord } from "../../models/TimetableRecord";
import { getTimetableRecords } from "../../utils/firebaseFunctions";
import { getDayTimeFromMinutesFromSunday } from "../../utils/timetableCreationFunctions";
import { Typography } from "@mui/material";
import Center from "../utils/Center";

interface Props {}

interface CellTimetableRecord {
  doc?: TimetableRecord;
  isRecord: boolean;
}

const getRecord = (i: number, docs: TimetableRecord[]) => {
  const index = docs.findIndex((doc) => {
    return doc.startTime <= i && doc.endTime > i;
  });

  if (index >= 0) {
    return { doc: docs[index], isRecord: true } as CellTimetableRecord;
  } else {
    return { doc: undefined, isRecord: false } as CellTimetableRecord;
  }
};

const TimetableWithControls = () => {
  const defaultHourSegment = 1;
  let defaultDayHours = [];
  for (let i = 0; i < 24; i += defaultHourSegment) {
    defaultDayHours.push(i);
  }

  const [documents, setDocuments] = useState<TimetableRecord[]>();
  const [timetableRecordsCells, setTimetableRecordsCells] =
    useState<CellTimetableRecord[]>();
  useEffect(() => {
    getTimetableRecords().then((docs) => {
      // console.log(docs);
      setDocuments(docs);

      const timetableRecordsCellsTemp = [];
      for (let i = 0; i < 24 * 60 * 7; i += 5) {
        timetableRecordsCellsTemp.push(getRecord(i, docs));
      }
      setTimetableRecordsCells(timetableRecordsCellsTemp);
    });
  }, []);

  return (
    <>
      <div className="controls"></div>
      <div className={style.weekWithHeadingsContainer}>
        <div className={style.timeHeading}>
          <div></div>
          {defaultDayHours.map((hour) => (
            <div className={style.hourSegment}>
              {getDayTimeFromMinutesFromSunday(hour * 60)}
            </div>
          ))}
        </div>
        <div className={style.daysHeading}>
          <Typography
            className={style.dayOfWeekHeading}
            variant="h6"
            color="primary"
            noWrap
          >
            <Center height={"100%"}>Sunday</Center>
          </Typography>
          <Typography
            className={style.dayOfWeekHeading}
            variant="h6"
            color="primary"
            noWrap
          >
            <Center height={"100%"}>Monday</Center>
          </Typography>
          <Typography
            className={style.dayOfWeekHeading}
            variant="h6"
            color="primary"
            noWrap
          >
            <Center height={"100%"}>Tuesday</Center>
          </Typography>
          <Typography
            className={style.dayOfWeekHeading}
            variant="h6"
            color="primary"
            noWrap
          >
            <Center height={"100%"}>Wednesday</Center>
          </Typography>
          <Typography
            className={style.dayOfWeekHeading}
            variant="h6"
            color="primary"
            noWrap
          >
            <Center height={"100%"}>Thursday</Center>
          </Typography>
          <Typography
            className={style.dayOfWeekHeading}
            variant="h6"
            color="primary"
            noWrap
          >
            <Center height={"100%"}>Friday</Center>
          </Typography>
          <Typography
            className={style.dayOfWeekHeading}
            variant="h6"
            color="primary"
            noWrap
          >
            <Center height={"100%"}>Saturday</Center>
          </Typography>
        </div>
        <div className={style.recordsContainer}>
          <div className={style.recordsTable}>
            {timetableRecordsCells &&
              timetableRecordsCells.map((record, i) => {
                return record.isRecord ? (
                  <div key={"record_" + i} className={style.record}>
                    <div
                      className={style.recordInner}
                      style={
                        record.doc
                          ? {
                              backgroundColor:
                                colorsWithHexValues[record.doc.color].hexValues
                                  .colorHex,
                            }
                          : {}
                      }
                    >
                      {i > 0 &&
                        i < timetableRecordsCells.length &&
                        record.isRecord &&
                        timetableRecordsCells[i + 1].isRecord &&
                        timetableRecordsCells[i + 1].doc?.activity ===
                          record.doc?.activity &&
                        (!timetableRecordsCells[i - 1].isRecord ||
                          timetableRecordsCells[i - 1].doc?.activity !==
                            record.doc?.activity) && (
                          <div
                            style={{
                              color:
                                colorsWithHexValues[record.doc!.color].hexValues
                                  .textHex,
                            }}
                            className={style.text}
                          >
                            {record.doc!.activity}
                          </div>
                        )}
                    </div>
                  </div>
                ) : (
                  <div key={"record" + i} className={style.record}></div>
                );
              })}
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
      </div>
      <div className="controls2"></div>
    </>
  );
};

export default TimetableWithControls;
