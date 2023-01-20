import { Color } from "../models/Color";

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