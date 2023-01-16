import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

interface Props {
  onSubmit: () => void;
}

const AddTimetableRecordForm = ({ onSubmit }: Props) => {
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState(1);
  const [startTime, setStartime] = useState(10);
  const [color, setColor] = useState("");

  const defaultHourSegment = 1;

  let defaultDayHours = [];
  for (let i = 0; i < 24; i += defaultHourSegment) {
    defaultDayHours.push(i);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      activity: { value: string };
      duration: { value: number };
      startTime: { value: number };
    };

    console.log(target);
    onSubmit();
  };

  return (
    <>
      <Typography variant="h6" color="inherit" noWrap>
        Add timetable record
      </Typography>
      <Box component="form" onSubmit={(e) => handleSubmit(e)} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="activity"
          label="Activity"
          name="activity"
          autoFocus
        />
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
            label="Start time"
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
        <Button type="submit" variant="outlined" sx={{ mt: 3, mb: 2 }}>
          Add
        </Button>
      </Box>
    </>
  );
};

export default AddTimetableRecordForm;
