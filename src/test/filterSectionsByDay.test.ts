import { readFileSync } from "fs";
import { CompiledCoursesData, DayType } from "../types/api.types";
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
    test("No filters applied", async () => {
        const realMap = await courseSectionMap;
        const fakeMap = deepCloneObject(realMap);
        const unwantedDays: DayType[] = [];

        const filteredResponse = filterSectionByDays(fakeMap, unwantedDays);
        expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));
    });

    test("Invalid day characters in DayType[]", async () => {
        const realMap = await courseSectionMap;
        const fakeMap = deepCloneObject(realMap);
        const unwantedDays = ["X", "Y", "Z"];
        expect(() =>
            filterSectionByDays(fakeMap, unwantedDays as DayType[]),
        ).toThrow(/Invalid day element in 'unwantedDays' array parameter/i);
    });

    test("Empty string filter", async () => {
        const realMap = await courseSectionMap;
        const fakeMap = deepCloneObject(realMap);
        const unwantedDays = [""];
        expect(() =>
            filterSectionByDays(fakeMap, unwantedDays as DayType[]),
        ).toThrow(/Invalid day element in 'unwantedDays' array parameter/i);
    });

    test("Duplicate days in DayType[]", async () => {
        const realMap = await courseSectionMap;
        const fakeMap = deepCloneObject(realMap);
        const unwantedDays: DayType[] = ["M", "M"];

        expect(() => filterSectionByDays(fakeMap, unwantedDays)).toThrow(
            /The 'unwantedDays' parameter can not have duplicate values/i,
        );
    });

    test("Single day filter", async () => {
        const realMap = await courseSectionMap;
        const fakeMap = deepCloneObject(realMap);
        const unwantedDays: DayType[] = ["T"];

        const filteredResponse = filterSectionByDays(fakeMap, unwantedDays);
        expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

        expect(
            didSectionsWithUnwantedDaysGetPrunedCorrectly(
                filteredResponse,
                unwantedDays,
            ),
        ).toBeTruthy();
    });

    test("Multi day and misordered filter", async () => {
        const realMap = await courseSectionMap;
        const fakeMap = deepCloneObject(realMap);
        const unwantedDays: DayType[] = ["F", "T", "X", "W", "M", "R"];

        const filteredResponse = filterSectionByDays(fakeMap, unwantedDays);
        expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

        expect(
            didSectionsWithUnwantedDaysGetPrunedCorrectly(
                filteredResponse,
                unwantedDays,
            ),
        ).toBeTruthy();
    });
});

function didSectionsWithUnwantedDaysGetPrunedCorrectly(
    filteredMap: CompiledCoursesData,
    unwantedDays: DayType[],
): boolean {
    for (const courseTitle in filteredMap) {
        for (const sectionNumber in filteredMap[courseTitle]) {
            for (const daysOfSection of filteredMap[courseTitle][sectionNumber]
                .days) {
                if (unwantedDays.includes(daysOfSection)) {
                    console.log(filteredMap[courseTitle][sectionNumber]);
                    return false;
                }
            }
        }
    }

    return true;
}
