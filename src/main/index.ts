import { Day } from "../types/api.types";
import { SelectedSections } from "../util/sectionFilters/filterSectionsByNumber";
import {
    ExtraOptions,
    generateFilteredSchedules,
} from "../util/generateFilteredSchedules";
import { TimeOptions } from "../util/sectionFilters/filterSectionsByTime";
import { collectSectionsData } from "../util/collectSectionsData";

const courseTitleToFetch: string[] = [
    //Set 1 of courses
    // "CS114",
    // "ENGL102",
    // "IS350",
    // "YWCC207",
    // "MATH337",
    // "FIN315",

    //Set 2 of courses
    // "CS241",
    // "CS280",
    // "CS301",
    // "CS331",
    // "CS332",
    // "COM312",
    // "YWCC307",
];

const main = async () => {
    //Sample filters based for specific sections
    const sectionFilters: SelectedSections = {
        // CS114: ["002", "004"],
        // ENGL102: ["089"],
        // IS350: ["002"],
        // MATH337: ["002"],
        // YWCC207: ["004"],
        //-------
        //-------
        //-------
        // CS241: ["003"],
        // CS280: ["009"],
        // CS301: ["001"],
        // CS331: ["001"],
        // CS332: ["001"],
        // COM312: ["025"],
        // YWCC307: ["007"],
    };

    //Filter based on days that the user desires no class
    const unwantedDay: Day[] = [];

    //Filter can be numbers or strings, but no mixing types
    const timeFilters: TimeOptions = {
        // before: 41400000,
        // after: undefined,
        //-------
        // before: "10:30 AM",
        // after: "9:30 PM",
    };

    //Fine tune options for filtering and generation
    const customOptions: ExtraOptions = {
        // filterAction: "NEGATIVE",
        // globallyAllowHonors: false,
        // localDisallowHonorsList: {},
        // lastPointDetails: [],
        // generateAmount: 1000000000000,
        // allowIncompleteSections: true,
    };

    console.time("Time for data fetch and schedule generation");

    const relevantCoursesData = await collectSectionsData(
        courseTitleToFetch,
        "Spring_2024",
    );

    await generateFilteredSchedules(
        relevantCoursesData,
        sectionFilters,
        unwantedDay,
        timeFilters,
        customOptions,
    );

    console.timeEnd("Time for data fetch and schedule generation");
};

main();
