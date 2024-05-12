import { readFileSync, writeFileSync } from "fs";
import {
    Filters,
    filterSectionsByNumber,
} from "./generationAlgos/filterSectionsByNumber";
import { Day } from "../types/api.types";
import { filterSectionByDays } from "./generationAlgos/filterSectionsByDays";
import { paginationGenerator } from "./generationAlgos/paginationGenerator";

export async function generateFilteredSchedules(
    sectionFilters: Filters,
    unwantedDays: Day[],
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

        const response = paginationGenerator(relevantCoursesData, [], 100);

        writeFileSync(WRITE_TO_PATH, JSON.stringify(response));

        console.log(response[0].length);
    } catch (error) {
        console.log(error);
    }

    return;
}
