import { LoadingButton } from "@mui/lab";
import { Box, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserData, updateCurrentUserTimetableSettings } from "../../utils/firebaseFunctions";
import { userDataStore } from "../../utils/userStore";

const TimetableSettingsForm = () => {
  const navigate = useNavigate();

  const [cellSize, setCellSize] = useState(60);
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitLoading(true);

    updateCurrentUserTimetableSettings({ cellSize: cellSize }).then(
      (response) => {
        console.log(response);
        setIsSubmitLoading(false);
        navigate("/");
      }
    );
  };

  return (
    <>
      <Typography variant="h6" color="inherit" noWrap>
        Timetable settings
      </Typography>
      <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="cellSize"
          label="Timetable cell size"
          helperText="Cell size in minutes"
          name="cellSize"
          autoFocus
          value={cellSize}
          onChange={(e) => setCellSize(parseInt(e.target.value || "0"))}
        />
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
