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
import { deepCloneObject } from "../generationAlgos/paginationGenerator";
import { filterSectionIfHonors } from "./filterSectionsIfHonors";

export interface SelectedSections {
    [courseTitle: string]: string[];
    // Array of section numbers
}

export type SecNumOptions = {
    filterAction?: "POSITIVE" | "NEGATIVE";
    globallyAllowHonors?: boolean;
    localDisallowHonorsList?: {
        [courseTitle: string]: boolean;
    };
};

const DEFAULT_SEC_NUM_OPTIONS: SecNumOptions = {
    filterAction: "POSITIVE",
    globallyAllowHonors: true,
    localDisallowHonorsList: {},
};

export function filterSectionsByNumber(
    courseSectionsMap: CompiledCoursesData,
    sectionFilters: SelectedSections,
    specialOptions: SecNumOptions = {},
): CompiledCoursesData {
    const { filterAction, globallyAllowHonors, localDisallowHonorsList } = {
        ...DEFAULT_SEC_NUM_OPTIONS,
        ...specialOptions,
    };

    if (
        typeof filterAction !== "undefined" &&
        (filterAction === null || typeof filterAction !== "string")
    ) {
        throw new Error(
            `'filterAction' can only have values "POSITIVE" or "NEGATIVE", if parameter is inputted`,
        );
    }

    if (
        typeof globallyAllowHonors !== "undefined" &&
        (globallyAllowHonors === null ||
            typeof globallyAllowHonors !== "boolean")
    ) {
        throw new Error(
            `'globallyAllowHonors' must be a boolean value if inputted`,
        );
    }

    if (Object.keys(sectionFilters).length === 0 && globallyAllowHonors) {
        return courseSectionsMap;
    }

    if (
        typeof localDisallowHonorsList !== "undefined" &&
        localDisallowHonorsList === null
    ) {
        throw new Error(
            `'localDisallowHonorsList' can not be null in options object`,
        );
    }

    //SET DEFAULT VALUES for undefined
    const actionType =
        typeof filterAction !== "undefined" ? filterAction : "POSITIVE";

    const allowHonorsOnFull =
        typeof globallyAllowHonors !== "undefined" ? globallyAllowHonors : true;

    const localBanHonorsList =
        typeof localDisallowHonorsList !== "undefined"
            ? localDisallowHonorsList
            : {};

    // console.log(actionType, allowHonorsOnFull, localBanHonorsList);

    isArraySubsetOfOther(
        Object.keys(sectionFilters),
        Object.keys(courseSectionsMap),
        (item: string) => {
            throw new Error(`Course ${item} does not exist in the dataset.`);
        },
    );

    for (const courseTitle in sectionFilters) {
        const sectionsToFilter = sectionFilters[courseTitle];
        const sectionsMapKeys = Object.keys(courseSectionsMap[courseTitle]);

        isArraySubsetOfOther(
            sectionsToFilter,
            sectionsMapKeys,
            (item: string) => {
                throw new Error(
                    `Section ${courseTitle}-${item} does not exist in the dataset.`,
                );
            },
        );
    }

    const cloneCourseSectionsMap =
        actionType === "POSITIVE"
            ? deepCloneObject(courseSectionsMap)
            : undefined;

    const areFiltersEmpty = Object.keys(sectionFilters).every(
        courseTitle => sectionFilters[courseTitle].length === 0,
    );

    //If globallyHonors false removed then all get removed, no exception
    if (!allowHonorsOnFull) {
        filterSectionIfHonors(courseSectionsMap);
    }
    //Locally remove honors on particular courses
    else if (Object.keys(localBanHonorsList).length !== 0) {
        const coursesToFilterOutHonors = Object.keys(localBanHonorsList).filter(
            courseTitle => localBanHonorsList[courseTitle],
        );

        if (coursesToFilterOutHonors.length !== 0)
            filterSectionIfHonors(courseSectionsMap, coursesToFilterOutHonors);
    }

    if (areFiltersEmpty) {
        return courseSectionsMap;
    }

    for (const courseTitle in sectionFilters) {
        const sectionsToFilter = sectionFilters[courseTitle];
        if (sectionsToFilter.length === 0) continue;

        if (actionType === "POSITIVE") {
            //Clear the secitons and initialize the courseTitle key
            //in the CSM dictionary for the course.
            const newSectionsData: Record<string, SectionData> = {};

            //For each section in sectionsToFilter, lookup in clone, and add to CSM
            for (const sectionNumber of sectionsToFilter) {
                newSectionsData[sectionNumber] =
                    cloneCourseSectionsMap[courseTitle][sectionNumber];
            }

            courseSectionsMap[courseTitle] = newSectionsData;
        }

        if (actionType === "NEGATIVE") {
            for (const sectionToPrune of sectionsToFilter) {
                //sectionToPrune if Honors do not exist. So verify
                if (courseSectionsMap[courseTitle][sectionToPrune]) {
                    delete courseSectionsMap[courseTitle][sectionToPrune];
                }
            }
        }
    }
    return courseSectionsMap;
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

export function clearDictionary<T extends Record<string, unknown>>(obj: T): T {
    Object.keys(obj).forEach(key => {
        delete obj[key];
    });

    return obj;
}
