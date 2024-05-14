import { Day } from "../types/api.types";
import { Schedule } from "../types/schedule.types";
import { SelectedSections } from "../util/sectionFilters/filterSectionsByNumber";
import { generateFilteredSchedules } from "../util/generateFilteredSchedules";
import { TimeOptions } from "../util/sectionFilters/filterSectionsByTime";

const inputObject = [
    "CS114",
    "ENGL102",
    "IS350",
    "YWCC207",
    "MATH337",
    "FIN315",
];

const main = async () => {
    const sectionFilters: SelectedSections = {
        // CS114: ["002", "004"],
        // ENGL102: ["089"],
        // IS350: ["102"],
        // MATH337: ["002"],
        // YWCC207: ["004"],
    };
    const unwantedDay: Day[] = ["M", "F", "S"];

    const timeFilters: TimeOptions = {
        // before: 50000000,
        // after: 100000000,
    };

    console.time("Running generation");

    await generateFilteredSchedules(sectionFilters, unwantedDay, timeFilters, {
        generateAmount: 1000,
        allowIncompleteSections: true,
    });

    console.timeEnd("Running generation");
};

main();
