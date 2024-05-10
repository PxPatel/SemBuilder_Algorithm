import {
    CompiledCoursesData,
    DAY,
    DeepClone,
    SectionData,
} from "../../types/api.types";
import { ReportSchedules, Schedule } from "../../types/schedule.types";

/**
 * So the larger algorithm needs to output an array of Schedules
 * Each schedule is an object of days of the week (Monday to Saturday)
 *
 * The underlying recur function will take a key from the keys array, and iterate through the sections of that key
 * If a section does not conflict with the current partial schedule
 * - Add it to the schedule
 * - Call the recur function
 * - Remove the section from the partial schedule
 * Else
 * - Continue to next iteration
 * Finally
 *
 *
 * Base cases
 * If keys array is empty, add the schedule to the Schedule[] and return
 *
 *
 * Recur function arguments:
 * - Data: Record<Course, SectionAPIResponse>
 * - DataKeys: Course[]
 * - ResultArray: Schedule[]
 * - CurrentSchedule: Schedule
 */

/**
 * So since an entire list of schedules is not feasibly to store, a pagination mechanism will be implemented
 * Each call will generate x number more schedules to be presented. This saves computation effort and memory
 * The recursive program will continue until a certain array length is achieved and then dismantle the stack
 *
 * To call for more generation, a new methodology must be designed. Online research for help.
 * Current thoughts are more parameter guided recursion. From the last input, the function will also output
 * an object detailing an image of the stack.
 */

export function scheduleGenerator(
    relevantCoursesData: CompiledCoursesData,
): ReportSchedules {
    const resultArray: ReportSchedules = [];
    const currentSchedule: Schedule = {
        M: [],
        T: [],
        W: [],
        R: [],
        F: [],
        S: [],
        X: [],
    };

    auxScheduleGenerator(
        relevantCoursesData,
        Object.keys(relevantCoursesData),
        0,
        resultArray,
        currentSchedule,
    );

    return resultArray;
}

export function auxScheduleGenerator(
    data: CompiledCoursesData,
    dataKeys: string[],
    dataKeyIndex: number,
    resultArray: ReportSchedules,
    currentSchedule: Schedule,
): void {
    if (dataKeys.length === dataKeyIndex) {
        resultArray.push(deepCloneObject(currentSchedule));
        return;
    }

    const selectedCourseKey = dataKeys[dataKeyIndex];
    for (const sectionNumber in data[selectedCourseKey]) {
        if (
            !doesScheduleHaveConflict(
                data[selectedCourseKey][sectionNumber],
                currentSchedule,
                data,
            )
        ) {
            const daysOfSection = data[selectedCourseKey][sectionNumber].days;
            const updatedSchedule = deepCloneObject(currentSchedule);
            for (const day of daysOfSection) {
                updatedSchedule[day].push(
                    data[selectedCourseKey][sectionNumber].section_id,
                );
            }

            auxScheduleGenerator(
                data,
                dataKeys,
                dataKeyIndex + 1,
                resultArray,
                updatedSchedule,
            );
        }
    }
    return;
}

function doesScheduleHaveConflict(
    sectionData: SectionData,
    currentSchedule: Schedule,
    data: CompiledCoursesData,
): boolean {
    if (sectionData === null) {
        throw Error("No section data provided");
    }

    if (
        sectionData.days.length === 0 ||
        sectionData.days.includes("X") ||
        sectionData.status.toUpperCase() === "CANCELLED"
    ) {
        return true;
    }

    for (const day of sectionData.days) {
        //Iterate through the section_ids of the sections
        //currently in currSchedule for a particular day
        for (const sectionId of currentSchedule[day]) {
            //Decompose the courseName, and sectionNumber from id
            const [, courseTitle, sectionNumber] =
                getSectionMetaDataFromSectionID(sectionId);

            //Get the "dayIndex" of the selectedDay in the days array
            //of the traversing section
            const matchIndex =
                data[courseTitle][sectionNumber].days.indexOf(day);
            //With the matchingIndex, find the corresponding start and end time of the section
            //for the particular day
            const startTime =
                data[courseTitle][sectionNumber].start_times[matchIndex];
            const endTime =
                data[courseTitle][sectionNumber].end_times[matchIndex];

            //If the start or end time of the selectedSection is inbetween
            //the times of the traversing section
            //return true to report the conflict
            if (
                isTimeInBetweenInterval(
                    sectionData.start_times[sectionData.days.indexOf(day)],
                    startTime,
                    endTime,
                ) ||
                isTimeInBetweenInterval(
                    sectionData.end_times[sectionData.days.indexOf(day)],
                    startTime,
                    endTime,
                )
            ) {
                return true;
            }
        }
    }

    //If the selectedSection passes through all the traversings section
    //then there is no conflict and thus return false
    return false;
}

function getSectionMetaDataFromSectionID(
    sectionId: string,
): [string, string, string] {
    const [semesterTitle, sectionIdentity] = sectionId.split("_");
    const [courseTitle, sectionNumber] = sectionIdentity.split("-");

    return [semesterTitle, courseTitle, sectionNumber];
}

function isTimeInBetweenInterval(
    x: number,
    earlierBound: number,
    laterBound: number,
): boolean {
    return x >= earlierBound && x <= laterBound;
}

function deepCloneObject<T>(obj: T): DeepClone<T> {
    return JSON.parse(JSON.stringify(obj));
}

function foo(a: number, b: number): any {
    return a + b;
}
