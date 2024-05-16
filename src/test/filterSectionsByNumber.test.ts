import { readFileSync } from "fs";
import { CompiledCoursesData } from "../types/api.types";
import {
    SecNumOptions,
    SelectedSections,
    filterSectionsByNumber,
} from "../util/sectionFilters/filterSectionsByNumber";
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
    describe("Edge cases and Errors", () => {
        test("No filters applied", async () => {
            const realMap = await courseSectionMap;
            const fakeMap = deepCloneObject(realMap);
            const sectionFilters: SelectedSections = {};

            const filteredResponse = filterSectionsByNumber(
                fakeMap,
                sectionFilters,
            );
            expect(filteredResponse).toEqual(realMap);
        });

        test("Invalid course filter", async () => {
            const realMap = await courseSectionMap;
            const fakeMap = deepCloneObject(realMap);
            const sectionFilters: SelectedSections = {
                CS280: ["004", "002"],
                FIN315: ["002", "102"],
                MATH337: ["002", "H02"],
                ENGL102: ["089"],
            };

            expect(() =>
                filterSectionsByNumber(fakeMap, sectionFilters),
            ).toThrow(/course/i);
        });

        test("Invalid section filter", async () => {
            const realMap = await courseSectionMap;
            const fakeMap = deepCloneObject(realMap);
            const sectionFilters: SelectedSections = {
                CS114: ["FOO", "002"],
                FIN315: ["002", "102"],
                MATH337: ["002", "BAR"],
                ENGL102: ["089"],
            };

            expect(() =>
                filterSectionsByNumber(fakeMap, sectionFilters),
            ).toThrow(/section/i);
        });

        test("Invalid action parameter", async () => {
            const realMap = await courseSectionMap;
            const fakeMap = deepCloneObject(realMap);
            const sectionFilters: SelectedSections = {
                CS114: ["004", "002"],
            };
            const filterAction: "POSITIVE" | "NEGATIVE" = null;

            expect(() =>
                filterSectionsByNumber(fakeMap, sectionFilters, {
                    filterAction,
                }),
            ).toThrow(/action/i);
        });
    });

    describe("Positive/Global Allow/No Local", () => {
        test("One section positive filter - 1", async () => {
            const realMap = await courseSectionMap;
            const fakeMap = deepCloneObject(realMap);
            const sectionFilters: SelectedSections = {
                CS114: ["004"],
            };

            const filteredResponse = filterSectionsByNumber(
                fakeMap,
                sectionFilters,
                { filterAction: "POSITIVE" },
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
            const sectionFilters: SelectedSections = {
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
            const sectionFilters: SelectedSections = {
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
            const sectionFilters: SelectedSections = {
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
            const sectionFilters: SelectedSections = {
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
    });

    describe("Negative/Global Allow/No Local", () => {
        test("One section negative filter - 1", async () => {
            const realMap = await courseSectionMap;
            const fakeMap = deepCloneObject(realMap);
            const sectionFilters: SelectedSections = {
                CS114: ["004"],
            };

            const filteredResponse = filterSectionsByNumber(
                fakeMap,
                sectionFilters,
                { filterAction: "NEGATIVE" },
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
            const sectionFilters: SelectedSections = {
                ENGL102: ["089"],
            };

            const filteredResponse = filterSectionsByNumber(
                fakeMap,
                sectionFilters,
                { filterAction: "NEGATIVE" },
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
            const sectionFilters: SelectedSections = {
                CS114: ["004", "002"],
            };

            const filteredResponse = filterSectionsByNumber(
                fakeMap,
                sectionFilters,
                { filterAction: "NEGATIVE" },
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
            const sectionFilters: SelectedSections = {
                CS114: ["004", "002"],
                FIN315: ["002"],
            };

            const filteredResponse = filterSectionsByNumber(
                fakeMap,
                sectionFilters,
                { filterAction: "NEGATIVE" },
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
            const sectionFilters: SelectedSections = {
                CS114: ["004", "002"],
                FIN315: ["002", "102"],
                MATH337: ["002", "H02"],
                ENGL102: ["089"],
            };

            const filteredResponse = filterSectionsByNumber(
                fakeMap,
                sectionFilters,
                { filterAction: "NEGATIVE" },
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
    });

    describe("Positive/Global Disallow/No Local", () => {
        test("One positive and non-H filter - 1", async () => {
            const realMap = await courseSectionMap;
            const fakeMap = deepCloneObject(realMap);
            const sectionFilters: SelectedSections = {
                CS114: ["004"],
            };

            const specialOptions: SecNumOptions = {
                filterAction: "POSITIVE",
                globallyAllowHonors: false,
            };

            const filteredResponse = filterSectionsByNumber(
                fakeMap,
                sectionFilters,
                specialOptions,
            );
            expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

            expect(
                didMapGetPositivelyPrunedCorrectly(
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();

            expect(
                areUnfilteredPropertiesUnaltered(
                    realMap,
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();
        });

        test("One positive and non-H filter - 2", async () => {
            const realMap = await courseSectionMap;
            const fakeMap = deepCloneObject(realMap);
            const sectionFilters: SelectedSections = {
                ENGL102: ["089"],
            };

            const specialOptions: SecNumOptions = {
                filterAction: "POSITIVE",
                globallyAllowHonors: false,
            };

            const filteredResponse = filterSectionsByNumber(
                fakeMap,
                sectionFilters,
                specialOptions,
            );
            expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

            expect(
                didMapGetPositivelyPrunedCorrectly(
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();

            expect(
                areUnfilteredPropertiesUnaltered(
                    realMap,
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();
        });

        test("One positive and non-H filter - 3", async () => {
            const realMap = await courseSectionMap;
            const fakeMap = deepCloneObject(realMap);
            const sectionFilters: SelectedSections = {
                CS114: ["H02", "H04"],
            };

            const specialOptions: SecNumOptions = {
                filterAction: "POSITIVE",
                globallyAllowHonors: false,
            };

            const filteredResponse = filterSectionsByNumber(
                fakeMap,
                sectionFilters,
                specialOptions,
            );
            expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

            expect(
                didMapGetPositivelyPrunedCorrectly(
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();

            expect(
                areUnfilteredPropertiesUnaltered(
                    realMap,
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();
        });

        test("Mutli section positive and non-H filter - 1", async () => {
            const realMap = await courseSectionMap;
            const fakeMap = deepCloneObject(realMap);
            const sectionFilters: SelectedSections = {
                CS114: ["004", "002"],
            };

            const specialOptions: SecNumOptions = {
                filterAction: "POSITIVE",
                globallyAllowHonors: false,
            };

            const filteredResponse = filterSectionsByNumber(
                fakeMap,
                sectionFilters,
                specialOptions,
            );
            expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

            expect(
                didMapGetPositivelyPrunedCorrectly(
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();

            expect(
                areUnfilteredPropertiesUnaltered(
                    realMap,
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();
        });

        test("Mutli course positive and non-H filters - 1", async () => {
            const realMap = await courseSectionMap;
            const fakeMap = deepCloneObject(realMap);
            const sectionFilters: SelectedSections = {
                CS114: ["004", "002"],
                FIN315: ["002"],
            };

            const specialOptions: SecNumOptions = {
                filterAction: "POSITIVE",
                globallyAllowHonors: false,
            };

            const filteredResponse = filterSectionsByNumber(
                fakeMap,
                sectionFilters,
                specialOptions,
            );
            expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

            expect(
                didMapGetPositivelyPrunedCorrectly(
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();

            expect(
                areUnfilteredPropertiesUnaltered(
                    realMap,
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();
        });

        test("Mutli course positive and non-H filters - 2", async () => {
            const realMap = await courseSectionMap;
            const fakeMap = deepCloneObject(realMap);
            const sectionFilters: SelectedSections = {
                CS114: ["004", "002"],
                FIN315: ["002", "102"],
                MATH337: ["002", "H02"],
                ENGL102: ["089"],
            };
            const specialOptions: SecNumOptions = {
                filterAction: "POSITIVE",
                globallyAllowHonors: false,
            };

            const filteredResponse = filterSectionsByNumber(
                fakeMap,
                sectionFilters,
                specialOptions,
            );
            expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

            expect(
                didMapGetPositivelyPrunedCorrectly(
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();

            expect(
                areUnfilteredPropertiesUnaltered(
                    realMap,
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();
        });
    });

    describe("Negative/Global Disallow/No Local", () => {
        test("One negative and non-H filter - 1", async () => {
            const realMap = await courseSectionMap;
            const fakeMap = deepCloneObject(realMap);
            const sectionFilters: SelectedSections = {
                CS114: ["004"],
            };

            const specialOptions: SecNumOptions = {
                filterAction: "NEGATIVE",
                globallyAllowHonors: false,
            };

            const filteredResponse = filterSectionsByNumber(
                fakeMap,
                sectionFilters,
                specialOptions,
            );
            expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

            expect(
                didMapGetNegativelyPrunedCorrectly(
                    realMap,
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();

            expect(
                areUnfilteredPropertiesUnaltered(
                    realMap,
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();
        });

        test("One negative and non-H filter - 2", async () => {
            const realMap = await courseSectionMap;
            const fakeMap = deepCloneObject(realMap);
            const sectionFilters: SelectedSections = {
                ENGL102: ["089"],
            };

            const specialOptions: SecNumOptions = {
                filterAction: "NEGATIVE",
                globallyAllowHonors: false,
            };

            const filteredResponse = filterSectionsByNumber(
                fakeMap,
                sectionFilters,
                specialOptions,
            );
            expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

            expect(
                didMapGetNegativelyPrunedCorrectly(
                    realMap,
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();

            expect(
                areUnfilteredPropertiesUnaltered(
                    realMap,
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();
        });

        test("One negative and non-H filter - 3", async () => {
            const realMap = await courseSectionMap;
            const fakeMap = deepCloneObject(realMap);
            const sectionFilters: SelectedSections = {
                CS114: ["H02", "H04"],
            };

            const specialOptions: SecNumOptions = {
                filterAction: "NEGATIVE",
                globallyAllowHonors: false,
            };

            const filteredResponse = filterSectionsByNumber(
                fakeMap,
                sectionFilters,
                specialOptions,
            );
            expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

            expect(
                didMapGetNegativelyPrunedCorrectly(
                    realMap,
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();

            expect(
                areUnfilteredPropertiesUnaltered(
                    realMap,
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();
        });

        test("Mutli section negative and non-H filter - 1", async () => {
            const realMap = await courseSectionMap;
            const fakeMap = deepCloneObject(realMap);
            const sectionFilters: SelectedSections = {
                CS114: ["004", "002"],
            };

            const specialOptions: SecNumOptions = {
                filterAction: "NEGATIVE",
                globallyAllowHonors: false,
            };

            const filteredResponse = filterSectionsByNumber(
                fakeMap,
                sectionFilters,
                specialOptions,
            );
            expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

            expect(
                didMapGetNegativelyPrunedCorrectly(
                    realMap,
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();

            expect(
                areUnfilteredPropertiesUnaltered(
                    realMap,
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();
        });

        test("Mutli course negative and non-H filters - 1", async () => {
            const realMap = await courseSectionMap;
            const fakeMap = deepCloneObject(realMap);
            const sectionFilters: SelectedSections = {
                CS114: ["004", "002"],
                FIN315: ["002"],
            };

            const specialOptions: SecNumOptions = {
                filterAction: "NEGATIVE",
                globallyAllowHonors: false,
            };

            const filteredResponse = filterSectionsByNumber(
                fakeMap,
                sectionFilters,
                specialOptions,
            );
            expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

            expect(
                didMapGetNegativelyPrunedCorrectly(
                    realMap,
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();

            expect(
                areUnfilteredPropertiesUnaltered(
                    realMap,
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();
        });

        test("Mutli course negative and non-H filters - 2", async () => {
            const realMap = await courseSectionMap;
            const fakeMap = deepCloneObject(realMap);
            const sectionFilters: SelectedSections = {
                CS114: ["004", "002"],
                FIN315: ["002", "102"],
                MATH337: ["002", "H02"],
                ENGL102: ["089"],
            };
            const specialOptions: SecNumOptions = {
                filterAction: "NEGATIVE",
                globallyAllowHonors: false,
            };

            const filteredResponse = filterSectionsByNumber(
                fakeMap,
                sectionFilters,
                specialOptions,
            );
            expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

            expect(
                didMapGetNegativelyPrunedCorrectly(
                    realMap,
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();

            expect(
                areUnfilteredPropertiesUnaltered(
                    realMap,
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: false,
                    },
                ),
            ).toBeTruthy();
        });
    });

    describe("Negative/Global Allow/Local Applied", () => {
        test("Mutli course negative and non-H Local filters - 1", async () => {
            const realMap = await courseSectionMap;
            const fakeMap = deepCloneObject(realMap);
            const sectionFilters: SelectedSections = {
                CS114: ["004", "002"],
                FIN315: ["002"],
            };

            const localDisallowHonorsList = {
                CS114: true,
                MATH337: true,
                FIN315: false,
                ENGL102: true,
            };

            const specialOptions: SecNumOptions = {
                filterAction: "NEGATIVE",
                localDisallowHonorsList,
            };

            const filteredResponse = filterSectionsByNumber(
                fakeMap,
                sectionFilters,
                specialOptions,
            );
            expect(Object.keys(filteredResponse)).toEqual(Object.keys(realMap));

            expect(
                didMapGetNegativelyPrunedCorrectly(
                    realMap,
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: true,
                        localDisallowHonorsList,
                    },
                ),
            ).toBeTruthy();

            expect(
                areUnfilteredPropertiesUnaltered(
                    realMap,
                    filteredResponse,
                    sectionFilters,
                    {
                        globallyAllowHonors: true,
                        localDisallowHonorsList,
                    },
                ),
            ).toBeTruthy();
        });
    });
});

type Config = {
    globallyAllowHonors: boolean;
    localDisallowHonorsList?: {
        [courseTitle: string]: boolean;
    };
};

export function didMapGetPositivelyPrunedCorrectly(
    filteredMap: CompiledCoursesData,
    sectionFilters: SelectedSections,
    config: Config = { globallyAllowHonors: true },
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
    sectionFilters: SelectedSections,
    config: Config = { globallyAllowHonors: true, localDisallowHonorsList: {} },
): any {
    const courseTitlesFiltered = Object.keys(sectionFilters);
    for (const courseTitle of courseTitlesFiltered) {
        const sortedfilteredMapSections = deepCloneObject(
            Object.keys(filteredMap[courseTitle]),
        ).sort(compareSectionNumber);

        let sortedRawMapSections = deepCloneObject(
            Object.keys(rawMap[courseTitle]),
        ).sort(compareSectionNumber);

        // console.log("RAW", sortedRawMapSections);

        for (const sectionNumber of sectionFilters[courseTitle]) {
            sortedRawMapSections.splice(
                sortedRawMapSections.indexOf(sectionNumber),
                1,
            );
        }

        if (
            !config.globallyAllowHonors ||
            config.localDisallowHonorsList[courseTitle] === true
        ) {
            sortedRawMapSections = sortedRawMapSections.filter(
                sectionNumber => !sectionNumber.includes("H"),
            );
        }

        // console.log("MODIFIED", sortedRawMapSections);
        // console.log("FILTERED", sortedfilteredMapSections);

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
    sectionFilters: SelectedSections,
    config: Config = { globallyAllowHonors: true, localDisallowHonorsList: {} },
): boolean {
    const courseTitlesFiltered = Object.keys(sectionFilters);
    const courseTitlesNotFiltered = Object.keys(rawMap).filter(
        courseTitleInRaw => !courseTitlesFiltered.includes(courseTitleInRaw),
    );

    for (const courseTitle of courseTitlesNotFiltered) {
        // if (!deepEqual(rawMap[courseTitle], filteredMap[courseTitle]))
        //     return false;

        let sectionsFromRaw = Object.keys(rawMap[courseTitle]);

        if (
            !config.globallyAllowHonors ||
            config.localDisallowHonorsList[courseTitle] === true
        ) {
            sectionsFromRaw = sectionsFromRaw.filter(
                sectionNumber => !sectionNumber.includes("H"),
            );
        }

        // console.log(
        //     `${courseTitle} RAW-${Object.keys(rawMap[courseTitle]).length}`,
        // );

        // console.log(`${courseTitle} MODIFIED RAW-${sectionsFromRaw.length}`);

        // console.log(
        //     `${courseTitle} FILTERED-${
        //         Object.keys(filteredMap[courseTitle]).length
        //     }`,
        // );

        if (
            sectionsFromRaw.length !==
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
