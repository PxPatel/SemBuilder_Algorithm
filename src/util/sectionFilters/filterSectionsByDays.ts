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

import { CompiledCoursesData, Day, DayType } from "../../types/api.types";

export function filterSectionByDays(
    courseSectionsMap: CompiledCoursesData,
    unwantedDays: DayType[],
): CompiledCoursesData {
    if (unwantedDays.length === 0) {
        return courseSectionsMap;
    }

    //Defensively check the days array
    const possibleDayValues = ["M", "T", "W", "R", "F", "S", "X"];
    for (const day of unwantedDays) {
        if (day.length != 1 || !possibleDayValues.includes(day)) {
            throw new Error(
                "Invalid day element in 'unwantedDays' array parameter",
            );
        }
    }

    if (hasDuplicates(unwantedDays)) {
        throw new Error(
            "The 'unwantedDays' parameter can not have duplicate values",
        );
    }

    for (const courseTitle in courseSectionsMap) {
        for (const sectionNumber in courseSectionsMap[courseTitle]) {
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

function hasDuplicates(a: string[]) {
    const uniqueValues = new Set();

    // Iterate through the array
    for (let i = 0; i < a.length; i++) {
        // If the value already exists in the Set, return true
        if (uniqueValues.has(a[i])) {
            return true;
        }
        // Otherwise, add the value to the Set
        uniqueValues.add(a[i]);
    }
}
