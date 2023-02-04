import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUserData,
  updateCurrentUserTimetableSettings,
} from "../../utils/firebaseFunctions";
import { DEFAULT_CELL_SIZE } from "../../utils/timetableCreationFunctions";

const minutesStepOption = [
  {
    label: "5",
    id: 5,
  },
  {
    label: "10",
    id: 10,
  },
  {
    label: "15",
    id: 15,
  },
  {
    label: "20",
    id: 20,
  },
  {
    label: "30",
    id: 30,
  },
  {
    label: "1:00",
    id: 60,
  },
];
const TimetableSettingsForm = () => {
  const navigate = useNavigate();

  const [cellSize, setCellSize] = useState(DEFAULT_CELL_SIZE);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const loadUserSettings = () => {
    getCurrentUserData().then((response) => {
      setCellSize(response.timetableSettings.cellSize);
    });
  };

  useEffect(() => {
    //TODO: change it to the store value
    loadUserSettings();
  }, []);

  const handleCellSizeChange = (event: SelectChangeEvent) => {
    setCellSize(parseInt(event.target.value));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitLoading(true);

    updateCurrentUserTimetableSettings({ cellSize: cellSize }).then(() => {
      setIsSubmitLoading(false);
      navigate("/");
    });
  };

  return (
    <>
      <Typography variant="h6" color="inherit" noWrap>
        Timetable settings
      </Typography>
      <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
        <FormControl margin="normal" fullWidth>
          <InputLabel id="cellSize-label">Timetable cell size</InputLabel>
          <Select
            labelId="cellSize-label"
            id="cellSize"
            value={cellSize.toString()}
            label="Timetable cell size"
            onChange={handleCellSizeChange}
          >
            <MenuItem value={10}>10 minutes</MenuItem>
            <MenuItem value={15}>15 minutes</MenuItem>
            <MenuItem value={20}>20 minutes</MenuItem>
            <MenuItem value={30}>30 minutes</MenuItem>
            <MenuItem value={60}>1 hour</MenuItem>
            <MenuItem value={120}>2 hours</MenuItem>
            <MenuItem value={180}>3 hours</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <LoadingButton
            type="submit"
            variant="outlined"
            loading={isSubmitLoading}
            disabled={isSubmitLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            Save changes
          </LoadingButton>
        </Box>
      </Box>
    </>
  );
};

export default TimetableSettingsForm;
