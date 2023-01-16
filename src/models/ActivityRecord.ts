import { Color } from "./Color";

export interface Activity {
  id: string;
  uid: string;
  name: string;
  color: Color;
  description: string;

  dayOfWeek: string, // TODO: change to Date() ?
  timeFrom: string,
  timeTo: string,
}