import { readFileSync, writeFileSync } from "fs";
import {
    SelectedSections,
    filterSectionsByNumber,
} from "./sectionFilters/filterSectionsByNumber";
import { Day } from "../types/api.types";
import { filterSectionByDays } from "./sectionFilters/filterSectionsByDays";
import { paginationGenerator } from "./generationAlgos/paginationGenerator";
import {
    TimeOptions,
    filterSectionByTime,
} from "./sectionFilters/filterSectionsByTime";

export async function generateFilteredSchedules(
    sectionFilters: SelectedSections,
    unwantedDays: Day[],
    timeFilters: TimeOptions,
): Promise<void> {
    const READ_FROM_PATH =
        "C:\\Users\\laugh\\Downloads\\SemBuilder_Algo\\src\\logs\\data.json";

    const WRITE_TO_PATH =
        "C:\\Users\\laugh\\Downloads\\SemBuilder_Algo\\src\\logs\\data2.json";

    try {
        // const relevantCourseData = await collectSectionsData(inputObject);
        const relevantCoursesData = await JSON.parse(
            readFileSync(READ_FROM_PATH, "utf-8"),
        );

        filterSectionsByNumber(relevantCoursesData, sectionFilters, "POSITIVE");
        filterSectionByDays(relevantCoursesData, unwantedDays);
        filterSectionByTime(relevantCoursesData, timeFilters);

        const response = paginationGenerator(relevantCoursesData, {
            lastPointDetails: [],
            generateAmount: 100,
        });

        writeFileSync(WRITE_TO_PATH, JSON.stringify(response));

        console.log(response[0].length);
    } catch (error) {
        console.log(error);
    }

    return;
}
