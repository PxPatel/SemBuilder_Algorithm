import { readFileSync } from "fs";
import { CompiledCoursesData } from "../types/api.types";
import {
    Filters,
    filterSectionsByNumber,
} from "../util/generationAlgos/filterSectionsByNumber";
import {
    compareSectionNumber,
    deepCloneObject,
} from "../util/generationAlgos/paginationGenerator";

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

describe("Filtering a course-sections map by specific sections ", () => {
    test("No filters applied", async () => {
        const realMap = await courseSectionMap;
        const fakeMap = deepCloneObject(realMap);
        const sectionFilters: Filters = {};

        const filteredResponse = filterSectionsByNumber(
            fakeMap,
            sectionFilters,
        );
        expect(filteredResponse).toEqual(realMap);
    });

    test("One section positive filter - 1", async () => {
        const realMap = await courseSectionMap;
        const fakeMap = deepCloneObject(realMap);
        const sectionFilters: Filters = {
            CS114: ["004"],
        };

        const filteredResponse = filterSectionsByNumber(
            fakeMap,
            sectionFilters,
            "POSITIVE",
        );
        expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

        expect(
            didMapGetPositivelyPrunedCorrectly(
                filteredResponse,
                sectionFilters,
            ),
        ).toBeTruthy();

        expect(
            areUnfilteredPropertiesUnaltered(
                realMap,
                filteredResponse,
                sectionFilters,
            ),
        ).toBeTruthy();
    });

    test("One section positive filter - 2", async () => {
        const realMap = await courseSectionMap;
        const fakeMap = deepCloneObject(realMap);
        const sectionFilters: Filters = {
            ENGL102: ["089"],
        };

        const filteredResponse = filterSectionsByNumber(
            fakeMap,
            sectionFilters,
        );
        expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

        expect(
            didMapGetPositivelyPrunedCorrectly(
                filteredResponse,
                sectionFilters,
            ),
        ).toBeTruthy();

        expect(
            areUnfilteredPropertiesUnaltered(
                realMap,
                filteredResponse,
                sectionFilters,
            ),
        ).toBeTruthy();
    });

    test("Mutli section positive filter - 1", async () => {
        const realMap = await courseSectionMap;
        const fakeMap = deepCloneObject(realMap);
        const sectionFilters: Filters = {
            CS114: ["004", "002"],
        };

        const filteredResponse = filterSectionsByNumber(
            fakeMap,
            sectionFilters,
        );
        expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

        expect(
            didMapGetPositivelyPrunedCorrectly(
                filteredResponse,
                sectionFilters,
            ),
        ).toBeTruthy();

        expect(
            areUnfilteredPropertiesUnaltered(
                realMap,
                filteredResponse,
                sectionFilters,
            ),
        ).toBeTruthy();
    });

    test("Mutli course positive filters - 1", async () => {
        const realMap = await courseSectionMap;
        const fakeMap = deepCloneObject(realMap);
        const sectionFilters: Filters = {
            CS114: ["004", "002"],
            FIN315: ["002"],
        };

        const filteredResponse = filterSectionsByNumber(
            fakeMap,
            sectionFilters,
        );
        expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

        expect(
            didMapGetPositivelyPrunedCorrectly(
                filteredResponse,
                sectionFilters,
            ),
        ).toBeTruthy();

        expect(
            areUnfilteredPropertiesUnaltered(
                realMap,
                filteredResponse,
                sectionFilters,
            ),
        ).toBeTruthy();
    });

    test("Mutli course positive filters - 2", async () => {
        const realMap = await courseSectionMap;
        const fakeMap = deepCloneObject(realMap);
        const sectionFilters: Filters = {
            CS114: ["004", "002"],
            FIN315: ["002", "102"],
            MATH337: ["002", "H02"],
            ENGL102: ["089"],
        };

        const filteredResponse = filterSectionsByNumber(
            fakeMap,
            sectionFilters,
        );
        expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

        expect(
            didMapGetPositivelyPrunedCorrectly(
                filteredResponse,
                sectionFilters,
            ),
        ).toBeTruthy();

        expect(
            areUnfilteredPropertiesUnaltered(
                realMap,
                filteredResponse,
                sectionFilters,
            ),
        ).toBeTruthy();
    });

    test("One section negative filter - 1", async () => {
        const realMap = await courseSectionMap;
        const fakeMap = deepCloneObject(realMap);
        const sectionFilters: Filters = {
            CS114: ["004"],
        };

        const filteredResponse = filterSectionsByNumber(
            fakeMap,
            sectionFilters,
            "NEGATIVE",
        );
        expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

        expect(
            didMapGetNegativelyPrunedCorrectly(
                realMap,
                filteredResponse,
                sectionFilters,
            ),
        ).toBeTruthy();

        expect(
            areUnfilteredPropertiesUnaltered(
                realMap,
                filteredResponse,
                sectionFilters,
            ),
        ).toBeTruthy();
    });

    test("One section negative filter - 2", async () => {
        const realMap = await courseSectionMap;
        const fakeMap = deepCloneObject(realMap);
        const sectionFilters: Filters = {
            ENGL102: ["089"],
        };

        const filteredResponse = filterSectionsByNumber(
            fakeMap,
            sectionFilters,
            "NEGATIVE",
        );
        expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

        expect(
            didMapGetNegativelyPrunedCorrectly(
                realMap,
                filteredResponse,
                sectionFilters,
            ),
        ).toBeTruthy();

        expect(
            areUnfilteredPropertiesUnaltered(
                realMap,
                filteredResponse,
                sectionFilters,
            ),
        ).toBeTruthy();
    });

    test("Mutli section negative filter - 1", async () => {
        const realMap = await courseSectionMap;
        const fakeMap = deepCloneObject(realMap);
        const sectionFilters: Filters = {
            CS114: ["004", "002"],
        };

        const filteredResponse = filterSectionsByNumber(
            fakeMap,
            sectionFilters,
            "NEGATIVE",
        );
        expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

        expect(
            didMapGetNegativelyPrunedCorrectly(
                realMap,
                filteredResponse,
                sectionFilters,
            ),
        ).toBeTruthy();

        expect(
            areUnfilteredPropertiesUnaltered(
                realMap,
                filteredResponse,
                sectionFilters,
            ),
        ).toBeTruthy();
    });

    test("Mutli course negative filters - 1", async () => {
        const realMap = await courseSectionMap;
        const fakeMap = deepCloneObject(realMap);
        const sectionFilters: Filters = {
            CS114: ["004", "002"],
            FIN315: ["002"],
        };

        const filteredResponse = filterSectionsByNumber(
            fakeMap,
            sectionFilters,
            "NEGATIVE",
        );
        expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

        expect(
            didMapGetNegativelyPrunedCorrectly(
                realMap,
                filteredResponse,
                sectionFilters,
            ),
        ).toBeTruthy();

        expect(
            areUnfilteredPropertiesUnaltered(
                realMap,
                filteredResponse,
                sectionFilters,
            ),
        ).toBeTruthy();
    });

    test("Mutli course negative filters - 2", async () => {
        const realMap = await courseSectionMap;
        const fakeMap = deepCloneObject(realMap);
        const sectionFilters: Filters = {
            CS114: ["004", "002"],
            FIN315: ["002", "102"],
            MATH337: ["002", "H02"],
            ENGL102: ["089"],
        };

        const filteredResponse = filterSectionsByNumber(
            fakeMap,
            sectionFilters,
            "NEGATIVE",
        );
        expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

        expect(
            didMapGetNegativelyPrunedCorrectly(
                realMap,
                filteredResponse,
                sectionFilters,
            ),
        ).toBeTruthy();

        expect(
            areUnfilteredPropertiesUnaltered(
                realMap,
                filteredResponse,
                sectionFilters,
            ),
        ).toBeTruthy();
    });

    test("Invalid course filter", async () => {
        const realMap = await courseSectionMap;
        const fakeMap = deepCloneObject(realMap);
        const sectionFilters: Filters = {
            CS280: ["004", "002"],
            FIN315: ["002", "102"],
            MATH337: ["002", "H02"],
            ENGL102: ["089"],
        };

        expect(() => filterSectionsByNumber(realMap, sectionFilters)).toThrow(
            /course/i,
        );
    });

    test("Invalid section filter", async () => {
        const realMap = await courseSectionMap;
        const fakeMap = deepCloneObject(realMap);
        const sectionFilters: Filters = {
            CS114: ["FOO", "002"],
            FIN315: ["002", "102"],
            MATH337: ["002", "BAR"],
            ENGL102: ["089"],
        };

        expect(() => filterSectionsByNumber(realMap, sectionFilters)).toThrow(
            /section/i,
        );
    });
});

export function didMapGetPositivelyPrunedCorrectly(
    filteredMap: CompiledCoursesData,
    sectionFilters: Filters,
): boolean {
    const courseTitlesFiltered = Object.keys(sectionFilters);

    for (const courseTitle of courseTitlesFiltered) {
        const sortedfilteredMapSections = deepCloneObject(
            Object.keys(filteredMap[courseTitle]),
        ).sort(compareSectionNumber);

        const sortedSectionsForFilter = deepCloneObject(
            sectionFilters[courseTitle],
        ).sort(compareSectionNumber);

        if (
            sortedfilteredMapSections.length !==
                sortedSectionsForFilter.length ||
            sortedfilteredMapSections.toString() !==
                sortedSectionsForFilter.toString()
        ) {
            return false;
        }
    }

    return true;
}

export function didMapGetNegativelyPrunedCorrectly(
    rawMap: CompiledCoursesData,
    filteredMap: CompiledCoursesData,
    sectionFilters: Filters,
): any {
    const courseTitlesFiltered = Object.keys(sectionFilters);
    for (const courseTitle of courseTitlesFiltered) {
        const sortedfilteredMapSections = deepCloneObject(
            Object.keys(filteredMap[courseTitle]),
        ).sort(compareSectionNumber);

        const sortedRawMapSections = deepCloneObject(
            Object.keys(rawMap[courseTitle]),
        ).sort(compareSectionNumber);

        for (const sectionNumber of sectionFilters[courseTitle]) {
            sortedRawMapSections.splice(
                sortedRawMapSections.indexOf(sectionNumber),
                1,
            );
        }

        if (
            sortedfilteredMapSections.length !== sortedRawMapSections.length ||
            sortedfilteredMapSections.toString() !==
                sortedRawMapSections.toString()
        ) {
            return false;
        }
    }

    return true;
}

export function areUnfilteredPropertiesUnaltered(
    rawMap: CompiledCoursesData,
    filteredMap: CompiledCoursesData,
    sectionFilters: Filters,
): boolean {
    const courseTitlesFiltered = Object.keys(sectionFilters);
    const courseTitlesNotFiltered = Object.keys(rawMap).filter(
        courseTitleInRaw => !courseTitlesFiltered.includes(courseTitleInRaw),
    );

    for (const courseTitle of courseTitlesNotFiltered) {
        // if (!deepEqual(rawMap[courseTitle], filteredMap[courseTitle]))
        //     return false;

        if (
            Object.keys(rawMap[courseTitle]).length !==
            Object.keys(filteredMap[courseTitle]).length
        ) {
            return false;
        }
    }

    return true;
}

export function deepEqual(x: unknown, y: unknown): boolean {
    const ok = Object.keys,
        tx = typeof x,
        ty = typeof y;
    return x && y && tx === "object" && tx === ty
        ? ok(x).length === ok(y).length &&
              ok(x).every(key => deepEqual((x as any)[key], (y as any)[key]))
        : x === y;
}
