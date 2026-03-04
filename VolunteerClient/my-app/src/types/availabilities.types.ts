import { Day } from "./enums.types";

export type AvailabilityType = {
  day: Day;
  from_Time: string;   // TimeSpan מגיע כ־string
  to_Time: string;
};