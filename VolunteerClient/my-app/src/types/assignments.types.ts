
import { AssignmentStatus } from "./enums.types";

export type AssignmentType = {
  id: number;
  volunteerID: number;
  helpRequestID: number;
  assignedAt: string; // DateTime מגיע כ־string
  status: AssignmentStatus;
};