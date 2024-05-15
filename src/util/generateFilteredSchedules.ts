import { readFileSync, writeFileSync } from "fs";
import {
    SelectedSections,
    filterSectionsByNumber,
} from "./sectionFilters/filterSectionsByNumber";
import { CompiledCoursesData, Day } from "../types/api.types";
import { filterSectionByDays } from "./sectionFilters/filterSectionsByDays";
import { paginationGenerator } from "./generationAlgos/paginationGenerator";
import {
    TimeOptions,
    filterSectionByTime,
} from "./sectionFilters/filterSectionsByTime";
import { LastPointDetails } from "../types/schedule.types";

export type ExtraOptions = {
    lastPointDetails?: LastPointDetails;
    generateAmount?: number;
    allowIncompleteSections?: boolean;
};

export async function generateFilteredSchedules(
    sectionFilters: SelectedSections,
    unwantedDays: Day[],
    timeFilters: TimeOptions,
    customOptions: ExtraOptions = {},
): Promise<void> {
    const READ_FROM_PATH =
        "C:\\Users\\laugh\\Downloads\\SemBuilder_Algo\\src\\logs\\data.json";

    const WRITE_TO_PATH =
        "C:\\Users\\laugh\\Downloads\\SemBuilder_Algo\\src\\logs\\data2.json";

    const { lastPointDetails, generateAmount, allowIncompleteSections } =
        customOptions;

    try {
        // const relevantCourseData = await collectSectionsData(inputObject);
        const relevantCoursesData = (await JSON.parse(
            readFileSync(READ_FROM_PATH, "utf-8"),
        )) as CompiledCoursesData;

        filterSectionsByNumber(relevantCoursesData, sectionFilters, {
            action: "POSITIVE",
        });
        filterSectionByDays(relevantCoursesData, unwantedDays);
        filterSectionByTime(relevantCoursesData, timeFilters);

        const response = paginationGenerator(relevantCoursesData, {
            lastPointDetails: lastPointDetails,
            generateAmount: generateAmount,
            allowIncompleteSections: allowIncompleteSections,
        });

        writeFileSync(WRITE_TO_PATH, JSON.stringify(response));

        console.log("Number of schedules generated:", response[0].length);
    } catch (error) {
        console.log(error);
    }

    return;
}
