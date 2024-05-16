import { CompiledCoursesData } from "../../types/data.types";

export function filterSectionIfHonors(
    courseSectionsMap: CompiledCoursesData,
    coursesToFilters?: string[],
): CompiledCoursesData {
    const coursesToIterateThrough = coursesToFilters
        ? coursesToFilters
        : Object.keys(courseSectionsMap);

    for (const courseTitle of coursesToIterateThrough) {
        for (const sectionNumber in courseSectionsMap[courseTitle]) {
            if (sectionNumber.charAt(0) === "H") {
                delete courseSectionsMap[courseTitle][sectionNumber];
            }
        }
    }

    return courseSectionsMap;
}
