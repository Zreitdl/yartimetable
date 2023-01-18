import {
  Button,
  FormControl,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { getTimetableRecords } from "../../utils/firebaseFunctions";
import { TimetableRecord } from "../../models/TimetableRecord";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { colorsWithHexValues } from "../../models/Color";
import { daysOfWeek } from "../../models/DaysOfWeek";

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
  const [documents, setDocuments] = useState<TimetableRecord[]>();
  useEffect(() => {
    getTimetableRecords().then((docs) => {
      // console.log(docs);
      setDocuments(docs);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
              <StyledTableCell align="right"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents?.map((row) => (
              <TableRow key={row.activity + row.uid + row.startTime}>
                <TableCell component="th" scope="row">
                  <span
                    style={{
                      backgroundColor:
                        colorsWithHexValues[row.color].hexValues.colorHex,
                      color: colorsWithHexValues[row.color].hexValues.textHex,
                      border:
                        "1px solid " +
                        colorsWithHexValues[row.color].hexValues.borderHex,
                      borderRadius: "2px",
                      padding: "2px 10px",
                      marginRight: "10px",
                      display: "inline-block",
                      position: "relative",
                    }}
                  >
                    {row.activity}
                  </span>
                </TableCell>
                <TableCell align="right">{row.startTime}</TableCell>
                <TableCell align="right">{row.endTime}</TableCell>
                <TableCell align="right">{daysOfWeek[row.dayOfWeek].name}</TableCell>
                <TableCell align="right">
                  <IconButton aria-label="edit">
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton aria-label="delete">
                    <DeleteIcon color="warning" />
                  </IconButton>
                </TableCell>
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
