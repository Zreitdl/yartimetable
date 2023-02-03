import { Color } from "../models/Color";
import { TimetableRecord } from "../models/TimetableRecord";

export const TIMETABLE_RENDER_MINUTES_STEP = 5;
export const DEFAULT_CELL_SIZE = 60;

// value 120 => return "2:00"
export const getDayTimeFromMinutesFromSunday = (value: number) => {
  const dayOfWeek = getDayOfWeekFromMinutesFromSunday(value);
  const dayTimeMinutesTotal = value - dayOfWeek * 60 * 24;
  const dayHours = Math.trunc(dayTimeMinutesTotal / 60);
  const dayMinutes = value - dayOfWeek * 60 * 24 - dayHours * 60;
  
  return (dayHours < 10 ? "0" + dayHours : dayHours) + ":" + (dayMinutes < 10 ? "0" + dayMinutes : dayMinutes);
}

export const getDayOfWeekFromMinutesFromSunday  = (value: number) => {
  return Math.trunc(value / (24 * 60));
}

export const getTimetableRecordPreviewFromCellNumber: (value: number) => TimetableRecord = (cellNumber: number) => {
  const minutesFromSunday = cellNumber * TIMETABLE_RENDER_MINUTES_STEP;
  const dayOfWeek = getDayOfWeekFromMinutesFromSunday(minutesFromSunday);
  const startTime = Math.trunc(minutesFromSunday/DEFAULT_CELL_SIZE) * DEFAULT_CELL_SIZE;

  return { id: "", activity: "", color: Color.Purple, dayOfWeek: dayOfWeek, startTime: startTime, endTime: startTime + DEFAULT_CELL_SIZE, duration: DEFAULT_CELL_SIZE} as TimetableRecord;
}