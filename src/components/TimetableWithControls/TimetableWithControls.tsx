import style from "./_.module.scss";
import { colorsWithHexValues } from "../../models/Color";
import { useEffect, useState } from "react";
import { TimetableRecord } from "../../models/TimetableRecord";
import {
  getCurrentUserData,
  getTimetableRecords,
} from "../../utils/firebaseFunctions";
import {
  DEFAULT_CELL_SIZE,
  getDayTimeFromMinutesFromSunday,
  getTimetableRecordPreviewFromCellNumber,
  TIMETABLE_RENDER_MINUTES_STEP,
} from "../../utils/timetableCreationFunctions";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  DialogContent,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import Center from "../utils/Center";
import AddOrUpdateTimetableRecordForm from "../AddOrUpdateTimetableRecordForm";
import { Link } from "react-router-dom";

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

const modalStyling = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
};

const weekDays = [0, 1, 2, 3, 4, 5, 6];

const TimetableWithControls = () => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // const [documents, setDocuments] = useState<TimetableRecord[]>();
  const [viewableTimetableRecord, setViewableTimetableRecord] =
    useState<TimetableRecord>();
  const [timetableRecordsCells, setTimetableRecordsCells] =
    useState<CellTimetableRecord[]>();

  const [cellSize, setCellSize] = useState(0);

  const [daySegments, setDaySegments] = useState<number[]>(); // in minutes from daystart

  const updateDocuments = () => {
    getTimetableRecords().then((docs) => {
      const timetableRecordsCellsTemp = [];
      for (let i = 0; i < 24 * 60 * 7; i += TIMETABLE_RENDER_MINUTES_STEP) {
        timetableRecordsCellsTemp.push(getRecord(i, docs));
      }
      setTimetableRecordsCells(timetableRecordsCellsTemp);
    });
  };

  const loadUserSettings = () => {
    getCurrentUserData().then((response) => {
      const newCellSize =
        response.timetableSettings.cellSize || DEFAULT_CELL_SIZE;
      setCellSize(newCellSize);

      let defaultDayHours = [];
      for (let i = 0; i < 24 * 60; i += newCellSize) {
        defaultDayHours.push(i);
      }

      setDaySegments(defaultDayHours);
    });
  };

  useEffect(() => {
    updateDocuments();
    loadUserSettings();
  }, []);

  const handleViewModalOpen = (doc: TimetableRecord) => {
    setViewableTimetableRecord(doc);
    setViewModalOpen(true);
  };

  const handleFreeCellClick = (cellNumber: number) => {
    setViewableTimetableRecord(
      getTimetableRecordPreviewFromCellNumber(cellNumber, cellSize)
    );
    setIsAddModalOpen(true);
  };

  const handleViewModalClose = () => {
    setViewModalOpen(false);
  };

  const handleAddModalOpen = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const onEditSubmitted = () => {
    handleViewModalClose();
    updateDocuments();
  };

  const onDeleteCompleted = () => {
    handleViewModalClose();
    updateDocuments();
  };

  const onAddSubmitted = () => {
    handleAddModalClose();
    updateDocuments();
  };

  const addTimetableRecordModal = (
    <>
      <Modal
        open={isAddModalOpen}
        onClose={handleAddModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyling}>
          <DialogContent>
            <IconButton
              aria-label="close"
              onClick={handleAddModalClose}
              sx={{
                position: "absolute",
                right: 0,
                top: 0,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <AddOrUpdateTimetableRecordForm
              onSubmitedCallback={onAddSubmitted}
              editableRecord={viewableTimetableRecord}
              isEdit={false}
            />
          </DialogContent>
        </Box>
      </Modal>
    </>
  );

  const viewTimetableRecordModal = viewableTimetableRecord && (
    <>
      <Modal
        open={viewModalOpen}
        onClose={handleViewModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyling}>
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
            <AddOrUpdateTimetableRecordForm
              onSubmitedCallback={onEditSubmitted}
              editableRecord={viewableTimetableRecord}
              onDeletedCallback={onDeleteCompleted}
              isEdit={true}
            />
          </DialogContent>
        </Box>
      </Modal>
    </>
  );

  return (
    <>
      {viewTimetableRecordModal}
      {addTimetableRecordModal}
      <Box sx={{ display: "flex", mb: 2, justifyContent: "end" }}>
        <Link
          to="/settings"
          style={{ textDecoration: "none", marginRight: "0px" }}
        >
          <Button variant="outlined" color="primary">
            Settings
          </Button>
        </Link>
        <Button
          sx={{ ml: 2 }}
          variant="outlined"
          color="primary"
          onClick={() => handleAddModalOpen()}
        >
          Add new
        </Button>
      </Box>
      <div className={style.weekWithHeadingsContainer}>
        <div className={style.timeHeading}>
          <div></div>
          {daySegments?.map((segment) => (
            <div key={"dayHourTitle__" + segment} className={style.hourSegment}>
              {getDayTimeFromMinutesFromSunday(segment)}
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
                  <div
                    key={"record" + i}
                    onClick={() => handleFreeCellClick(i)}
                    className={style.record}
                  ></div>
                );
              })}
          </div>
          {daySegments &&
            cellSize &&
            weekDays.map((day) => (
              <div key={"weekDay__" + day} className={style.dayCol}>
                {daySegments?.map((segment) => (
                  <div key={"weekDay__" + day + "__segment__" + segment} className={style.hourSegment}></div>
                ))}
              </div>
            ))}
        </div>
      </div>
      <div className="controls2"></div>
    </>
  );
};

export default TimetableWithControls;
