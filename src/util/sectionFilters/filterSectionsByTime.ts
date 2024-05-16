/**
 * So this is function will take a course-sections map and then filter section
 * based on the times of the sections. There will be two filter types: No class before and no class after
 * If given before = 100, all the start times for the sections must be after 100.
 * Similiarly, if after = 100, all the end times for the sections must be before 100.
 */

import { CompiledCoursesData } from "../../types/api.types";

export type TimeOptions =
    | {
          before?: number;
          after?: number;
      }
    | {
          before?: string;
          after?: string;
      };

export function filterSectionByTime(
    courseSectionData: CompiledCoursesData,
    timeFilters: TimeOptions,
): CompiledCoursesData {
    const { before, after } = timeFilters;

    if (typeof before === "undefined" && typeof after === "undefined") {
        return courseSectionData;
    }

    if (before === null || after === null) {
        throw new Error(
            "Invalid time filter: 'before' and 'after' must be numbers or undefined.",
        );
    }

    //Convert if string
    const earlyCap =
        typeof before === "number"
            ? before
            : typeof before === "string"
            ? convertStringTimeToNumber(before)
            : undefined;

    const lateCap =
        typeof after === "number"
            ? after
            : typeof after === "string"
            ? convertStringTimeToNumber(after)
            : undefined;

    console.log("TIMES:", earlyCap, lateCap);

    if (
        earlyCap !== undefined &&
        lateCap !== undefined &&
        earlyCap >= lateCap
    ) {
        throw new Error("'before' must be less than 'after'.");
    }
    for (const courseTitle in courseSectionData) {
        const sectionNumbers = Object.keys(courseSectionData[courseTitle]);

        for (const sectionNumber of sectionNumbers) {
            const { start_times, end_times } =
                courseSectionData[courseTitle][sectionNumber];

            let shouldDelete = false;

            for (let i = 0; i < start_times.length; i++) {
                if (start_times[i] === null || end_times[i] === null) {
                    continue;
                }

                if (
                    (earlyCap !== undefined && start_times[i] < earlyCap) ||
                    (lateCap !== undefined && end_times[i] > lateCap)
                ) {
                    shouldDelete = true;
                    break;
                }
            }

            if (shouldDelete) {
                delete courseSectionData[courseTitle][sectionNumber];
            }
        }
    }
    return courseSectionData;
}

function convertStringTimeToNumber(timeStr: string): number {
    try {
        if (
            typeof timeStr !== "string" ||
            timeStr === "" ||
            timeStr === "TBA"
        ) {
            undefined;
        }

        // Parse time
        const [time, meridiem] = timeStr.split(" ");
        let hours = parseInt(time.split(":")[0]);
        const minutes = parseInt(time.split(":")[1]);
        const period = meridiem.toUpperCase();
        hours = period === "PM" && hours !== 12 ? hours + 12 : hours;

        // Calculate milliseconds from midnight
        const startMilliseconds = (hours * 60 + minutes) * 60 * 1000;

        return startMilliseconds;
    } catch (error) {
        console.log("ERROR IN TIME", error.message);
        console.log(timeStr);
        throw Error;
    }
}
