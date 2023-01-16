import {
  Button,
  FormControl,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";

interface Props {}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.secondary,
  },
}));

function createData(
  activity: string,
  startTime: string,
  endTime: string,
  dayOfWeek: string
) {
  return { activity, startTime, endTime, dayOfWeek };
}

const rows = [createData("Work", "10:00", "12:00", "Monday")];

const TimetableRecordsList = ({}: Props) => {
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <h2>Timetable records</h2>
      <div className="records"></div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Activity</StyledTableCell>
              <StyledTableCell align="right">Start time</StyledTableCell>
              <StyledTableCell align="right">End time</StyledTableCell>
              <StyledTableCell align="right">Day of week</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.activity}>
                <TableCell component="th" scope="row">
                  {row.activity}
                </TableCell>
                <TableCell align="right">{row.startTime}</TableCell>
                <TableCell align="right">{row.endTime}</TableCell>
                <TableCell align="right">{row.dayOfWeek}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <FormControl margin="normal">
        <Link to="add" style={{ textDecoration: "none" }}>
          <Button variant="outlined" color="primary">
            Add new
          </Button>
        </Link>
      </FormControl>
    </>
  );
};

export default TimetableRecordsList;
