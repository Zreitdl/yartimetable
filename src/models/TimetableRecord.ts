// import { Color } from "./Color";

export interface TimetableRecord {
  uid: string;
  activity: string;
  activityId?: string;
  color: number; // from Color enum
  description?: string;

  dayOfWeek: number, // 0 is sunday
  startTime: number, // minutes from 0 to 24*60-1
  endTime: number, // minutes from 0 to 24*60-1
  duration: number // minutes from - to 24*60
}