export type QUERY_PARAMETERS = Partial<Record<PARAMS, string>>;

export type PARAMS =
    | "semester"
    | "department"
    | "course"
    | "classLevel"
    | "courseNumber"
    | "days"
    | "DSO"
    | "credits"
    | "instructor"
    | "crn"
    | "status"
    | "limit";

export type SectionAPIResponse = {
    item_count: number;
    data: SectionData[];
};

export interface SectionData extends Omit<AltSection, "co_sem_id"> {
    course_semester_info: CourseSemester;
}

export type DAY = "M" | "T" | "W" | "R" | "F" | "S" | "X";

interface AltSection {
    co_sem_id: string;
    credits: number;
    crn: number;
    days: DAY[] | null;
    end_times: number[] | null;
    info: string | null;
    instructor: string | null;
    location: string[] | null;
    section_id: string;
    section_number: string;
    start_times: number[] | null;
    status: string;
}

interface CourseSemester {
    co_sem_id: string;
    course_id: number;
    semester_id: string;
}

export interface CompiledCoursesData {
    [courseTitle: string]: Record<string, SectionData>;
}

export type DeepClone<T> = T extends Record<string, unknown>
    ? {
          [K in keyof T]: DeepClone<T[K]>;
      }
    : T;