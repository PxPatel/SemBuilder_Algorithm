import { DayType } from "./api.types";

export type CourseName = string;

export type SectionNumber = string;

export type SectionId = string;

export type SectionsInDay = SectionId[];

export type Schedule = Record<DayType, SectionsInDay>;

export type ReportSchedules = Schedule[];
// export type ReportSchedules = string[][];

export type LastPointDetails = string[];
