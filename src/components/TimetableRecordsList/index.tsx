import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import {
  deleteTimetableRecord,
  getTimetableRecords,
} from "../../utils/firebaseFunctions";
import { TimetableRecord } from "../../models/TimetableRecord";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { colorsWithHexValues } from "../../models/Color";
import { daysOfWeek } from "../../models/DaysOfWeek";
import { getDayTimeFromMinutesFromSunday } from "../../utils/timetableCreationFunctions";

interface Props {}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.secondary,
  },
}));

const TimetableRecordsList = ({}: Props) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // const [isDeletingLoading, setIsDeletingLoading] = useState(false);
  const [deletingDoc, setDeletingDoc] = useState<TimetableRecord>();

  const updateDocuments = () => {
    getTimetableRecords().then((docs) => {
      // console.log(docs);
      setDocuments(docs);
    });
  };

  const [documents, setDocuments] = useState<TimetableRecord[]>();
  useEffect(() => {
    updateDocuments();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onClickDeleteTimetableRecord = (doc: TimetableRecord) => {
    setDeletingDoc(doc);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (deletingDoc) {
      deleteTimetableRecord(deletingDoc.id).then(() => {
        updateDocuments();
        setDeleteDialogOpen(false);
      });
    } else {
      throw new Error("There is no deleting doc");
    }
  };

  const handleCancel = () => {
    setDeleteDialogOpen(false);
  };

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
              <TableRow key={row.id}>
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
                <TableCell align="right">
                  {getDayTimeFromMinutesFromSunday(row.startTime)}
                </TableCell>
                <TableCell align="right">
                  {getDayTimeFromMinutesFromSunday(row.endTime)}
                </TableCell>
                <TableCell align="right">
                  {daysOfWeek[row.dayOfWeek].name}
                </TableCell>
                <TableCell align="right">
                  <IconButton aria-label="edit">
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => onClickDeleteTimetableRecord(row)}
                  >
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
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete timetable record?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {deletingDoc?.activity +
              " on " +
              daysOfWeek[deletingDoc?.dayOfWeek ?? 0].name +
              " at " +
              getDayTimeFromMinutesFromSunday(deletingDoc?.startTime ?? 0)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TimetableRecordsList;
