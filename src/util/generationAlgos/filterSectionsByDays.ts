/**
 * Similar to filterSectionsByNumber(), this pre-premutation function will prune the data map based on a day filter
 * Essentially, given an array of the days and a course-sections map, the program will iterate through all courses
 * and their sections and prune/keep a section based on its .days property
 *
 * Negative filtering: means that the days provided in the parameters are not the days on which the section takes place
 * Other words: section.day has no common element with param.days
 *
 * Maybe other types would be implemented in future, but only negative filtering for now
 */

import { CompiledCoursesData, Day } from "../../types/api.types";

export function filterSectionByDays(
    courseSectionsMap: CompiledCoursesData,
    unwantedDays: Day[],
    // action?: "NEGATIVE",
): CompiledCoursesData {
    if (unwantedDays.length === 0) {
        return courseSectionsMap;
    }

    for (const courseTitle of Object.keys(courseSectionsMap)) {
        for (const sectionNumber of Object.keys(
            courseSectionsMap[courseTitle],
        )) {
            if (
                unwantedDays.some(unwantedDay =>
                    courseSectionsMap[courseTitle][sectionNumber].days.includes(
                        unwantedDay,
                    ),
                )
            ) {
                delete courseSectionsMap[courseTitle][sectionNumber];
            }
        }
    }

    return courseSectionsMap;
}
