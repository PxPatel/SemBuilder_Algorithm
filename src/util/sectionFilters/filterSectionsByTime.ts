import { CompiledCoursesData } from "../../types/api.types";

/**
 * So this is function will take a course-sections map and then filter section
 * based on the times of the sections. There will be two filter types: No class before and no class after
 * If given before = 100, all the start times for the sections must be after 100.
 * Similiarly, if after = 100, all the end times for the sections must be before 100.
 *
 *
 */

export type TimeOptions = {
    before?: number;
    after?: number;
};

export function filterSectionByTime(
    courseSectionData: CompiledCoursesData,
    timeFilters?: TimeOptions,
): CompiledCoursesData {
    if (typeof timeFilters === "undefined") {
        return courseSectionData;
    }

    const { before, after } = timeFilters;

    if (typeof before === "undefined" && typeof after === "undefined") {
        return courseSectionData;
    }

    if (before === null || after === null) {
        throw new Error(
            "Invalid time filter: 'before' and 'after' must be numbers or undefined.",
        );
    }

    if (before !== undefined && after !== undefined && before >= after) {
        throw new Error("'before' must be less than 'after'.");
    }
    for (const courseTitle of Object.keys(courseSectionData)) {
        const sectionNumbers = Object.keys(courseSectionData[courseTitle]);

        for (const sectionNumber of sectionNumbers) {
            const { start_times, end_times } =
                courseSectionData[courseTitle][sectionNumber];

            let shouldDelete = false;

            for (let i = 0; i < start_times.length; i++) {
                if (
                    (before !== undefined && start_times[i] < before) ||
                    (after !== undefined && end_times[i] > after)
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