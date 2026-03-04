import { HelpRequestStatus } from "./enums.types";

export type HelpRequestType = {
  id: number;
  needyID: number;
  categoryID: number;
  description: string;
  status: HelpRequestStatus;
  createdAt: string;
  latitude: number;
  longitude: number;
};