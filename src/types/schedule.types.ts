import { DAY } from "./api.types";

export type CourseName = string;

export type SectionNumber = string;

export type SectionId = string;

export type SectionsInDay = SectionId[];

export type Schedule = Record<DAY, SectionsInDay>;

export type ReportSchedules = Schedule[];

export type LastPointDetails = string[];
