/**
 * This file is meant to handle the manipulation for better filtering
 *
 * Ideally an iterative filtering was to happen on the generated set of schedule, which is easier to design
 * Another approach is to edit the parameters of the recursion function to constraint the output
 *
 * When the filter of specific section(s) is applied, pruning the relevantCoursesData is the best approach
 * This does a few things. It quickens the recursive process and gives a predictable output
 * However, this does mess with certain things. In general, the filter is to be applied after first plain generation
 * So the plain generation and the filtered recursive output will overlaps. One thing that is possible is to continue
 * using pagination, and continue recurring from LPD with the pruned dataset. A lot of logistical code needs to be
 * implemented but I see this as a possible approach.
 *
 * The program will iterate through as many schedules are stored for filter out schedules. If the count is less than
 * what is required, we can run the paginationGenerator function with pruned data, and LPD to fill the remaining slots.
 *
 * This does leave the question as to how we will manage the LPD, as we need to be mindful of where we stop generating
 * on the unfiltered algorithm. Perhaps we can set multiple variables. That is much harder to maintain as the app scales
 *
 * I think a good option, is performing a certian type of generation (plain or pruned) based on the requirements. It is
 * more expensive since each change to the filter will perform the generation again, but is the most simpliest
 *
 * Two option:
 * -Continue plain generation until the count of filtered schedules meet desired number, (cache additional schedules)
 * -Modify function parameters and perform generation again for each new filter case (no caching, and hard resets)
 *
 * I think for now, lets implement option 2, modifying function parameters, since it seems more fun.
 *
 * Can either update the data and then return the updated data, and use the returned data to generate schedules
 * Or can have the paginationGenerator() be called inside the filter. I think easier to test if returned
 */

import { CompiledCoursesData, SectionData } from "../../types/api.types";
import { deepCloneObject } from "./paginationGenerator";

export interface Filters {
    [courseTitle: string]: string[]; // Array of section numbers
}

export function filterSectionsByNumber(
    courseSectionsMap: CompiledCoursesData,
    sectionFilters: Filters,
    action?: "POSITIVE" | "NEGATIVE",
): CompiledCoursesData {
    if (Object.keys(sectionFilters).length === 0) {
        return courseSectionsMap;
    }

    isArraySubsetOfOther(
        Object.keys(sectionFilters),
        Object.keys(courseSectionsMap),
        (item: string) => {
            throw new Error(`Course ${item} does not exist in the dataset.`);
        },
    );

    const actionType = action ? action : "POSITIVE";

    const clonedCourseSectionsMap: CompiledCoursesData =
        deepCloneObject(courseSectionsMap);

    for (const courseTitle in sectionFilters) {
        const sectionsToFilter = sectionFilters[courseTitle];
        if (sectionsToFilter.length === 0) continue;

        const sectionsMapKeys = Object.keys(
            clonedCourseSectionsMap[courseTitle],
        );

        isArraySubsetOfOther(
            sectionsToFilter,
            sectionsMapKeys,
            (item: string) => {
                throw new Error(
                    `Section ${courseTitle}-${item} does not exist in the dataset.`,
                );
            },
        );

        //POS = Only those sections should be in dataset
        //NEG = Those specific sections should not be in the dataset

        if (actionType === "POSITIVE") {
            clonedCourseSectionsMap[courseTitle] = {};

            for (const sectionNumber of sectionsToFilter) {
                clonedCourseSectionsMap[courseTitle][sectionNumber] =
                    deepCloneObject(
                        courseSectionsMap[courseTitle][sectionNumber],
                    );
            }
        } else {
            deleteSectionsFromMap(
                sectionsToFilter,
                clonedCourseSectionsMap[courseTitle],
            );
        }
    }

    return clonedCourseSectionsMap;
}
function deleteSectionsFromMap(
    sectionsToPrune: string[],
    sectionsMap: Record<string, SectionData>,
) {
    for (const pruningSectionNumber of sectionsToPrune) {
        delete sectionsMap[pruningSectionNumber];
    }
}

function isArraySubsetOfOther(
    child: string[],
    parent: string[],
    callback: (item: string) => void,
): void {
    child.forEach(item => {
        if (!parent.includes(item)) {
            callback(item);
        }
    });
}
