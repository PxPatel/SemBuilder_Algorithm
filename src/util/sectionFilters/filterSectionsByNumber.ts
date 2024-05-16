
import { CompiledCoursesData, SectionData } from "../../types/data.types";
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
