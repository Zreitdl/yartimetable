import style from "./_.module.scss";
import { colorsWithHexValues } from "../../models/Color";
import { useEffect, useState } from "react";
import { TimetableRecord } from "../../models/TimetableRecord";
import {
  deleteTimetableRecord,
  getTimetableRecords,
} from "../../utils/firebaseFunctions";
import { getDayTimeFromMinutesFromSunday } from "../../utils/timetableCreationFunctions";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import Center from "../utils/Center";
import { daysOfWeek } from "../../models/DaysOfWeek";
import { Link } from "react-router-dom";

interface CellTimetableRecord {
  doc?: TimetableRecord;
  isRecord: boolean;
}

const modalInnerStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  //p: 2,
};

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

// const DeleteModal = () => {
//   const [open, setOpen] = useState(false);
//   const handleOpen = () => {
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <>
//       <Button onClick={handleOpen}>Open Child Modal</Button>
//       <Modal
//         hideBackdrop
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="child-modal-title"
//         aria-describedby="child-modal-description"
//       >
//         <Box sx={{ ...style, width: 200 }}>
//           <h2 id="child-modal-title">Text in a child modal</h2>
//           <p id="child-modal-description">
//             Lorem ipsum, dolor sit amet consectetur adipisicing elit.
//           </p>
//           <Button onClick={handleClose}>Close Child Modal</Button>
//         </Box>
//       </Modal>
//     </>
//   );
// }

const TimetableWithControls = () => {
  const defaultHourSegment = 1;
  let defaultDayHours = [];
  for (let i = 0; i < 24; i += defaultHourSegment) {
    defaultDayHours.push(i);
  }

  const [viewModalOpen, setViewModalOpen] = useState(false);
  // const [documents, setDocuments] = useState<TimetableRecord[]>();
  const [viewableTimetableRecord, setViewableTimetableRecord] =
    useState<TimetableRecord>();
  const [timetableRecordsCells, setTimetableRecordsCells] =
    useState<CellTimetableRecord[]>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const updateDocuments = () => {
    getTimetableRecords().then((docs) => {
      // console.log(docs);
      // setDocuments(docs);

      const timetableRecordsCellsTemp = [];
      for (let i = 0; i < 24 * 60 * 7; i += 5) {
        timetableRecordsCellsTemp.push(getRecord(i, docs));
      }
      setTimetableRecordsCells(timetableRecordsCellsTemp);
    });
  };
  useEffect(() => {
    updateDocuments();
  }, []);

  const onClickDeleteTimetableRecord = () => {
    console.log("delete");
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (viewableTimetableRecord) {
      deleteTimetableRecord(viewableTimetableRecord.id).then(() => {
        updateDocuments();
        setDeleteDialogOpen(false);
        setViewModalOpen(false);
      });
    } else {
      throw new Error("There is no deleting doc");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleViewModalOpen = (doc: TimetableRecord) => {
    setViewableTimetableRecord(doc);
    setViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setViewModalOpen(false);
  };

  const deleteDialog = viewableTimetableRecord && (
    <Dialog
      open={deleteDialogOpen}
      onClose={handleDeleteCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Delete timetable record?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {viewableTimetableRecord?.activity +
            " on " +
            daysOfWeek[viewableTimetableRecord?.dayOfWeek ?? 0].name +
            " at " +
            getDayTimeFromMinutesFromSunday(
              viewableTimetableRecord?.startTime ?? 0
            )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteCancel}>Cancel</Button>
        <Button variant="contained" onClick={handleDelete} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );

  const viewTimetableRecordModal = viewableTimetableRecord && (
    <>
      <Modal
        open={viewModalOpen}
        onClose={handleViewModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalInnerStyle}>
          <DialogContent>
            <IconButton
              aria-label="close"
              onClick={handleViewModalClose}
              sx={{
                position: "absolute",
                right: 0,
                top: 0,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              sx={{
                backgroundColor:
                  colorsWithHexValues[viewableTimetableRecord.color].hexValues
                    .colorHex,

                border:
                  "1px solid " +
                  colorsWithHexValues[viewableTimetableRecord.color].hexValues
                    .borderHex,
                borderRadius: "2px",
                padding: "2px 10px",
                marginRight: "10px",
                display: "inline-block",
                position: "relative",
              }}
            >
              <Typography
                color={
                  colorsWithHexValues[viewableTimetableRecord.color].hexValues
                    .textHex
                }
                variant="h6"
                component="h2"
              >
                {viewableTimetableRecord.activity}
              </Typography>
            </Box>
            <Typography sx={{ mt: 2 }}>
              {getDayTimeFromMinutesFromSunday(
                viewableTimetableRecord.startTime
              ) +
                " -- " +
                getDayTimeFromMinutesFromSunday(
                  viewableTimetableRecord.endTime
                ) +
                " on " +
                daysOfWeek[viewableTimetableRecord.dayOfWeek].name}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              color="error"
              variant="outlined"
              onClick={() => onClickDeleteTimetableRecord()}
            >
              Delete
            </Button>
            <Link
              to={"/edit/" + viewableTimetableRecord.id}
              style={{ textDecoration: "none", marginLeft: "10px" }}
            >
              <Button color="primary" variant="contained" autoFocus>
                Edit
              </Button>
            </Link>
          </DialogActions>
        </Box>
      </Modal>
      {deleteDialog}
    </>
  );

  return (
    <>
      {viewTimetableRecordModal}
      <Box sx={{ display: "flex", mb: 2, justifyContent: "end" }}>
      {/* <Link to="/settings" style={{ textDecoration: "none", marginRight: "10px" }}> */}
          <Button disabled variant="outlined" color="primary">
            Settings
          </Button>
        {/* </Link> */}
        <Link to="/add" style={{ textDecoration: "none" }}>
          <Button variant="outlined" color="primary">
            Add new
          </Button>
        </Link>
      </Box>
      <div className={style.weekWithHeadingsContainer}>
        <div className={style.timeHeading}>
          <div></div>
          {defaultDayHours.map((hour) => (
            <div key={"dayHour__" + hour} className={style.hourSegment}>
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
                return record.isRecord && record.doc ? (
                  <div key={"record_" + i} className={style.record}>
                    <div
                      className={style.recordInner}
                      style={{
                        backgroundColor:
                          colorsWithHexValues[record.doc.color].hexValues
                            .colorHex,
                      }}
                      onClick={() => handleViewModalOpen(record.doc!)}
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
