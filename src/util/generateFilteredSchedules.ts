import { readFileSync, writeFileSync } from "fs";
import {
    SecNumOptions,
    SelectedSections,
    filterSectionsByNumber,
} from "./sectionFilters/filterSectionsByNumber";
import { CompiledCoursesData, Day } from "../types/api.types";
import { filterSectionByDays } from "./sectionFilters/filterSectionsByDays";
import {
    DEFAULT_GENERATION_AMOUNT,
    GenerationOptions,
    paginationGenerator,
} from "./generationAlgos/paginationGenerator";
import {
    TimeOptions,
    filterSectionByTime,
} from "./sectionFilters/filterSectionsByTime";
import { LastPointDetails } from "../types/schedule.types";

export type ExtraOptions = {
    lastPointDetails?: LastPointDetails;
    generateAmount?: number;
    allowIncompleteSections?: boolean;
    filterAction?: "POSITIVE" | "NEGATIVE";
    globallyAllowHonors?: boolean;
    localDisallowHonorsList?: {
        [courseTitle: string]: boolean;
    };
};

const DEFAULT_EXTRA_OPTIONS: ExtraOptions = {
    lastPointDetails: [],
    generateAmount: DEFAULT_GENERATION_AMOUNT,
    allowIncompleteSections: false,
    filterAction: "POSITIVE",
    globallyAllowHonors: true,
    localDisallowHonorsList: {},
};

export async function generateFilteredSchedules(
    relevantCoursesData: CompiledCoursesData,
    sectionFilters: SelectedSections,
    unwantedDays: Day[],
    timeFilters: TimeOptions,
    customOptions: ExtraOptions = {},
): Promise<void> {
    const { READ_FROM_PATH, WRITE_TO_PATH } = {
        READ_FROM_PATH:
            "C:\\Users\\laugh\\Downloads\\SemBuilder_Algo\\src\\logs\\data.json",
        WRITE_TO_PATH:
            "C:\\Users\\laugh\\Downloads\\SemBuilder_Algo\\src\\logs\\data2.json",
    };

    const {
        lastPointDetails,
        generateAmount,
        allowIncompleteSections,
        filterAction,
        globallyAllowHonors,
        localDisallowHonorsList,
    } = {
        ...DEFAULT_EXTRA_OPTIONS,
        ...customOptions,
    };

    // console.log(
    //     lastPointDetails,
    //     generateAmount,
    //     allowIncompleteSections,
    //     filterAction,
    //     globallyAllowHonors,
    //     localDisallowHonorsList,
    // );

    try {
        const relevantCoursesData = (await JSON.parse(
            readFileSync(READ_FROM_PATH, "utf-8"),
        )) as CompiledCoursesData;

        filterSectionsByNumber(relevantCoursesData, sectionFilters, {
            filterAction,
            globallyAllowHonors,
            localDisallowHonorsList,
        });
        filterSectionByDays(relevantCoursesData, unwantedDays);
        filterSectionByTime(relevantCoursesData, timeFilters);

        const response = paginationGenerator(relevantCoursesData, {
            lastPointDetails: lastPointDetails,
            generateAmount: generateAmount,
            allowIncompleteSections: allowIncompleteSections,
        });

        // writeFileSync(WRITE_TO_PATH, JSON.stringify(response));

        console.log("Number of schedules generated:", response[0].length);
    } catch (error) {
        console.log(error);
    }

    return;
}
