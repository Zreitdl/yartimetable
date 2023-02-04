import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Color, colorsWithHexValues } from "../../models/Color";
import {
  addOrUpdateUserTimetableRecord,
  deleteTimetableRecord,
  getTimetableRecord,
} from "../../utils/firebaseFunctions";
import { daysOfWeek } from "../../models/DaysOfWeek";
import { useNavigate, useParams } from "react-router-dom";
import Center from "../utils/Center";
import { TimetableRecord } from "../../models/TimetableRecord";
import {
  getDayTimeFromMinutesFromSunday,
  TIMETABLE_RENDER_MINUTES_STEP,
} from "../../utils/timetableCreationFunctions";
import dayjs, { Dayjs } from "dayjs";
import { TimePicker } from "@mui/x-date-pickers";
import DurationTimePicker from "../Inputs/DurationTimePicker";

interface Props {
  isEdit: boolean;
  editableTimetableRecordId?: string;
  editableRecord?: TimetableRecord;
  onSubmitedCallback?: () => void;
  onDeletedCallback?: () => void;
}

const AddOrUpdateTimetableRecordForm = (props: Props) => {
  const {
    isEdit,
    editableTimetableRecordId,
    editableRecord,
    onSubmitedCallback,
    onDeletedCallback,
  } = props;
  // TODO: change duration, startTime, endTime to minutes

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEditableRecord, setIsLoadingEditableRecord] = useState(true);
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState(60); // in minutes
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [startTime, setStartime] = useState<Dayjs | null>(
    dayjs().set("h", 10).set("minute", 0)
  ); // in minutes from dayStart
  const [color, setColor] = useState(3);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const defaultHourSegment = 1;

  const recordId = editableRecord
    ? editableRecord.id
    : editableTimetableRecordId || "";

  let defaultDayHours: number[] = [];

  for (let i = 0; i < 24; i += defaultHourSegment) {
    defaultDayHours.push(i);
  }

  const fillFormWithTimetableRecord = (record: TimetableRecord) => {
    setActivity(record.activity);
    setDuration(record.duration);
    setDayOfWeek(record.dayOfWeek);

    const recordHour = Math.trunc(
      (record.startTime - record.dayOfWeek * 24 * 60) / 60
    );
    const recordMinutes =
      record.startTime - record.dayOfWeek * 24 * 60 - recordHour * 60;
    setStartime(dayjs().set("h", recordHour).set("minute", recordMinutes));

    setColor(record.color);
  };

  const loadTimetableRecord = (id: string) => {
    getTimetableRecord(id).then((record) => {
      setIsLoadingEditableRecord(false);
      fillFormWithTimetableRecord(record);
    });
  };

  const handleStartTimeChange = (newValue: Dayjs | null) => {
    if (newValue && newValue?.isValid()) {
      const minutes =
        Math.round(newValue.minute() / TIMETABLE_RENDER_MINUTES_STEP) *
        TIMETABLE_RENDER_MINUTES_STEP;
      newValue = newValue.set("minutes", minutes);
    }

    setStartime(newValue);
  };

  const handleDurationChange = (newValue: number) => {
    // if (newValue && newValue?.isValid()) {
    //   const minutes =
    //     Math.round(newValue.minute() / TIMETABLE_RENDER_MINUTES_STEP) *
    //     TIMETABLE_RENDER_MINUTES_STEP;
    //   newValue = newValue.set("minutes", minutes);
    // }

    setDuration(newValue);
  };

  useEffect(() => {
    if (isEdit && editableTimetableRecordId) {
      loadTimetableRecord(editableTimetableRecordId);
    } else if (editableRecord) {
      setIsLoadingEditableRecord(false);
      fillFormWithTimetableRecord(editableRecord);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startTime?.isValid()) {
      return;
    }

    if (!duration) {
      return;
    }

    setIsLoading(true);

    const startTimeInMinutes = startTime!.hour() * 60 + startTime!.minute();

    addOrUpdateUserTimetableRecord({
      activity: activity,
      duration: duration,
      dayOfWeek: dayOfWeek,
      startTime: startTimeInMinutes + dayOfWeek * 60 * 24,
      endTime: startTimeInMinutes + dayOfWeek * 60 * 24 + duration,
      color: color,
      id: recordId,
    })
      .then((response) => {
        if (onSubmitedCallback) {
          onSubmitedCallback();
        }
        navigate("/");
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
      });
  };

  const onClickDeleteTimetableRecord = () => {
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (recordId) {
      deleteTimetableRecord(recordId).then(() => {
        setDeleteDialogOpen(false);
        if (onDeletedCallback) {
          onDeletedCallback();
        }
        navigate("/");
      });
    } else {
      throw new Error("There is no doc id to delete");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const deleteDialog = isEdit && (
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
          {activity +
            " on " +
            daysOfWeek[dayOfWeek ?? 0].name +
            " at " +
            startTime?.format("hh:mm")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteCancel}>Cancel</Button>
        <Button
          color="error"
          variant="contained"
          onClick={handleDelete}
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );

  return !isLoadingEditableRecord || !isEdit ? (
    <>
      {deleteDialog}
      {isEdit ? (
        <Typography variant="h6" color="inherit" noWrap>
          Edit timetable record
        </Typography>
      ) : (
        <Typography variant="h6" color="inherit" noWrap>
          Add timetable record
        </Typography>
      )}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="activity"
          label="Activity"
          name="activity"
          autoFocus
          value={activity}
          onChange={(e) => setActivity(e.target.value as string)}
        />
        <FormControl margin="normal" fullWidth>
          <InputLabel id="dayofweek-label">Day of week</InputLabel>
          <Select
            fullWidth
            labelId="dayofweek-label"
            id="dayofweek-select"
            value={dayOfWeek}
            label="Day of week"
            onChange={(e) => setDayOfWeek(e.target.value as number)}
          >
            {daysOfWeek.map((day) => (
              <MenuItem value={day.value} key={"dayofweek_" + day.value}>
                {daysOfWeek[day.value].name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <TimePicker
            label="Start time"
            value={startTime}
            ampm={false}
            minutesStep={TIMETABLE_RENDER_MINUTES_STEP}
            onChange={handleStartTimeChange}
            renderInput={(params: any) => <TextField {...params} />}
          />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <Typography color="label" variant="caption" sx={{ mb: 1 }}>
            Duration
          </Typography>
          <DurationTimePicker
            value={duration}
            onChange={handleDurationChange}
            title="Hour"
            id="duration"
          />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel id="color-label">Color</InputLabel>
          <Select
            fullWidth
            labelId="color-label"
            id="color-select"
            value={color}
            label="Color"
            onChange={(e) => setColor(e.target.value as number)}
          >
            {colorsWithHexValues.map((color) => (
              <MenuItem value={color.color} key={"color_" + color.color}>
                <span
                  style={{
                    backgroundColor: color.hexValues.colorHex,
                    color: color.hexValues.textHex,
                    border: "1px solid " + color.hexValues.borderHex,
                    borderRadius: "2px",
                    padding: "2px 10px",
                    marginRight: "10px",
                    display: "inline-block",
                    position: "relative",
                  }}
                >
                  {Color[color.color]}
                </span>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {isEdit ? (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <LoadingButton
              onClick={() => onClickDeleteTimetableRecord()}
              color="error"
              variant="outlined"
              loading={isLoading}
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              Delete
            </LoadingButton>
            <LoadingButton
              type="submit"
              variant="outlined"
              loading={isLoading}
              disabled={isLoading}
              sx={{ mt: 3, mb: 2, ml: 2 }}
            >
              Save changes
            </LoadingButton>
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <LoadingButton
              type="submit"
              variant="outlined"
              loading={isLoading}
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              Add
            </LoadingButton>
          </Box>
        )}
      </Box>
    </>
  ) : (
    <Center height={"200px"}>
      <CircularProgress />
    </Center>
  );
};

export default AddOrUpdateTimetableRecordForm;
