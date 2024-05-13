import { readFileSync } from "fs";
import { CompiledCoursesData, Day } from "../types/api.types";
import { filterSectionByDays } from "../util/sectionFilters/filterSectionsByDays";
import { deepCloneObject } from "../util/generationAlgos/paginationGenerator";

async function getCoursesData(): Promise<CompiledCoursesData> {
    try {
        return await JSON.parse(
            readFileSync(
                "C:\\Users\\laugh\\Downloads\\SemBuilder_Algo\\src\\logs\\data.json",
                "utf-8",
            ),
        );
    } catch (error) {
        console.log(error);
        return {};
    }
}

const courseSectionMap = getCoursesData();

describe.skip("Filtering a course-section map based on unwanted days", () => {
    test("Test 1", async () => {
        const realMap = await courseSectionMap;
        const fakeMap = deepCloneObject(realMap);
        const unwantedDays: Day[] = [];

        const filteredResponse = filterSectionByDays(fakeMap, unwantedDays);
        expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

        //Add more verifications
    });
});
