import { DayType } from "./data.types";

export type SectionsInDay = string[];

export type Schedule = Record<DayType, SectionsInDay>;

export type ReportSchedules = Schedule[];
// export type ReportSchedules = string[][];

export type LastPointDetails = string[];

export type DeepClone<T> = T extends Record<string, unknown>
    ? {
          [K in keyof T]: DeepClone<T[K]>;
      }
    : T;
