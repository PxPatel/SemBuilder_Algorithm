/**
 * As it sounds, this functions is intended to be called if the course-section map
 * needs to exlude honors courses.
 *
 * Lets suppose I want to add 2 features regarding honors. One of them is a global allowHonors, that affect all classes
 * Another is a local allowHonors that in the context of particular courseTitles
 * In terms of precedence, local will override global
 * I think the best way to do this will be to first use filterSectionsByNumber and in its iteration,
 * filter or keep honors. Once that is done, a certain parameter
 * will be passed to FSIH to ignore iterating through those certain courseTitle
 *
 * Specific > Local overrides Global.
 *
 * If Global false, No local disallow allowed at all,
 * If Global true, you can choose which sections to allow and which to not by checkbox
 *
 * Then you can just add into the existing FSN code
 *
 * If action == negative, perform normally,
 *
 * if action == positive, then simply dont run the honors code because it is what the user wants exactly
 */

import { CompiledCoursesData } from "../../types/api.types";

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
