import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Color, colorsWithHexValues } from "../../models/Color";
import { addOrUpdateUserTimetableRecord } from "../../utils/firebaseFunctions";
import { daysOfWeek } from "../../models/DaysOfWeek";
import { useNavigate } from "react-router-dom";

interface Props {
  timetableRecordId?: string;
}

const AddOrUpdateTimetableRecordForm = ({ timetableRecordId }: Props) => {
  // TODO: load timetableRecord if it is UPDATE request
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log(activity);
    addOrUpdateUserTimetableRecord({
      activity: activity,
      duration: duration * 60,
      dayOfWeek: dayOfWeek,
      startTime: startTime * 60,
      endTime: (startTime + duration) * 60,
      color: color,
    })
      .then((response) => {
        navigate("/list");
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
      });
  };

  return (
    <>
      <Typography variant="h6" color="inherit" noWrap>
        Add timetable record
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="activity"
          label="Activity"
          name="activity"
          autoFocus
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
          Add
        </LoadingButton>
      </Box>
    </>
  );
};

export default AddOrUpdateTimetableRecordForm;
