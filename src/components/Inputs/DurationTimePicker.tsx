import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import InputMask from "react-input-mask";

interface IDurationTimePickerProps {
  value: number;
  onChange: (value: number) => void; // value = total minutes
  minTime?: number; // in minutes
  maxTime?: number; // in minutes
  title?: string;
  id: string;
}

const hourOptions = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23,
];

const minutesOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

const DurationTimePicker = (props: IDurationTimePickerProps) => {
  const { value, onChange, minTime, maxTime, id } = props;

  const [minutes, setMinutes] = useState("");
  const [hours, setHours] = useState("");

  const maskInputValue = (value: string, type: "hour" | "minute") => {
    let resultString = "";

    for (let i = 0; i < value.length; i++) {
      const char = value.charAt(i);
      if (parseInt(char) || char === "0") {
        resultString += char;
      }
    }

    if (resultString.length > 2) {
      if (resultString[0] === "0") {
        resultString = resultString[1] + resultString[2];
      } else {
        resultString = resultString[0] + resultString[1];
      }
    }

    if (resultString.length === 1) {
      resultString = "0" + resultString;
    }

    const numberValue = parseInt(resultString) || 0;

    if (type === "hour") {
      if (numberValue > 23) {
        resultString = "23";
      }
    } else if (type === "minute") {
      if (numberValue > 59) {
        resultString = "59";
      }
    }

    return resultString;
  };

  useEffect(() => {
    const valueHour = Math.trunc(value / 60);
    const valueMinutes = value - valueHour * 60;

    setMinutes(valueMinutes.toString());
    setHours(valueHour.toString());
  }, [value]);

  const getTotalMinutes = (newHoursValue: string, newMinutesValue: string) => {
    return (parseInt(newMinutesValue) || 0) + (parseInt(newHoursValue) || 0) * 60
  }

  const handleMinuteChange = (value: string) => {
    const minutesMasked = maskInputValue(value, "minute");
    setMinutes(minutesMasked);
    onChange(getTotalMinutes(hours, minutesMasked));
  };

  const handleHourChange = (value: string) => {
    const hoursMasked = maskInputValue(value, "hour");
    setHours(hoursMasked);
    onChange(getTotalMinutes(hoursMasked, minutes));
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Autocomplete
          freeSolo
          id={id + "__hour"}
          options={hourOptions.map((option) => {
            return option.toString();
          })}
          value={hours}
          inputValue={hours}
          onInputChange={(event, newInputValue) => {
            handleHourChange(newInputValue);
          }}
          sx={{ width: 50 }}
          disableClearable={true}
          renderInput={(params) => (
            <TextField
              sx={{
                "& input": {
                  textAlign: "center",
                },
              }}
              variant="standard"
              {...params}
            />
          )}
        />
        <Box sx={{ mx: 1 }}> <Typography variant="caption">hours</Typography></Box>
        <Autocomplete
          freeSolo
          id={id + "__minute"}
          options={minutesOptions.map((option) => {
            return option.toString();
          })}
          disableClearable={true}
          inputValue={minutes}
          onInputChange={(event, newInputValue) => {
            handleMinuteChange(newInputValue);
          }}
          value={minutes}
          sx={{ width: 50 }}
          renderInput={(params) => (
            <TextField
              sx={{
                "& input": {
                  textAlign: "center",
                },
              }}
              variant="standard"
              {...params}
            />
          )}
        />
        <Box sx={{ mx: 1 }}> <Typography variant="caption">minutes</Typography></Box>
      </Box>
    </>
  );
};

export default DurationTimePicker;
