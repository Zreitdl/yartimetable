import {
  Box,
  CircularProgress,
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
  getTimetableRecord,
} from "../../utils/firebaseFunctions";
import { daysOfWeek } from "../../models/DaysOfWeek";
import { useNavigate, useParams } from "react-router-dom";
import Center from "../utils/Center";

interface Props {
  isEdit: boolean;
  editableTimetableRecordId?: string;
}

const AddOrUpdateTimetableRecordForm = (props: Props) => {
  const { isEdit, editableTimetableRecordId } = props;
  // TODO: load timetableRecord if it is UPDATE request
  // TODO: change duration, startTime, endTime to minutes

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEditableRecord, setIsLoadingEditableRecord] = useState(true);
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState(1);
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [startTime, setStartime] = useState(10);
  const [color, setColor] = useState(3);
  // const [color, setColor] = useState("");

  const defaultHourSegment = 1;

  let defaultDayHours = [];
  for (let i = 0; i < 24; i += defaultHourSegment) {
    defaultDayHours.push(i);
  }

  useEffect(() => {
    if (isEdit && editableTimetableRecordId) {
      loadTimetableRecord(editableTimetableRecordId);
    }
  }, []);

  const loadTimetableRecord = (id: string) => {
    getTimetableRecord(id).then((record) => {
      console.log(record);
      setIsLoadingEditableRecord(false);
      setActivity(record.activity);
      setDuration(Math.trunc(record.duration / 60));
      setDayOfWeek(record.dayOfWeek);
      setStartime(Math.trunc((record.startTime - record.dayOfWeek * 24 * 60) / 60));
      setColor(record.color);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    addOrUpdateUserTimetableRecord({
      activity: activity,
      duration: duration * 60,
      dayOfWeek: dayOfWeek,
      startTime: startTime * 60 + dayOfWeek * 60 * 24,
      endTime: (startTime + duration) * 60 + dayOfWeek * 60 * 24,
      color: color,
      id: editableTimetableRecordId || "",
    })
      .then((response) => {
        navigate("/");
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
      });
  };

  return !isLoadingEditableRecord || !isEdit ? (
    <>
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
          <InputLabel id="start-time-label">Start time</InputLabel>
          <Select
            fullWidth
            labelId="start-time-label"
            id="start-time-select"
            value={startTime}
            label="Start time"
            onChange={(e) => setStartime(e.target.value as number)}
          >
            {defaultDayHours.map((hour) => (
              <MenuItem value={hour} key={"start-time-label_" + hour}>
                {Math.trunc(hour) +
                  ":" +
                  (60 * (hour - Math.trunc(hour)) < 10
                    ? "0" + 60 * (hour - Math.trunc(hour))
                    : 60 * (hour - Math.trunc(hour)))}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel id="duration-label">Duration</InputLabel>
          <Select
            fullWidth
            labelId="duration-label"
            id="duration-select"
            value={duration}
            label="Duration"
            onChange={(e) => setDuration(e.target.value as number)}
          >
            {defaultDayHours.map((hour) => (
              <MenuItem value={hour} key={"duration_" + hour}>
                {Math.trunc(hour) +
                  ":" +
                  (60 * (hour - Math.trunc(hour)) < 10
                    ? "0" + 60 * (hour - Math.trunc(hour))
                    : 60 * (hour - Math.trunc(hour)))}
              </MenuItem>
            ))}
          </Select>
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
        <LoadingButton
          type="submit"
          variant="outlined"
          loading={isLoading}
          disabled={isLoading}
          sx={{ mt: 3, mb: 2 }}
        >
          {isEdit ? "Edit" : "Add"}
        </LoadingButton>
      </Box>
    </>
  ) : (
    <Center height={"200px"}>
      <CircularProgress />
    </Center>
  );
};

export default AddOrUpdateTimetableRecordForm;
