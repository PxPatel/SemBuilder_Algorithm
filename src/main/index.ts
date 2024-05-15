import { Day } from "../types/api.types";
import { SelectedSections } from "../util/sectionFilters/filterSectionsByNumber";
import { generateFilteredSchedules } from "../util/generateFilteredSchedules";
import { TimeOptions } from "../util/sectionFilters/filterSectionsByTime";
import { collectSectionsData } from "../util/collectSectionsData";

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
        before: undefined,
        after: undefined,
    };

    console.time("Running generation");

    // await generateFilteredSchedules(sectionFilters, unwantedDay, timeFilters, {
    //     generateAmount: 139,
    //     allowIncompleteSections: undefined,
    // });

    // await collectSectionsData(["CS114", "ENGL101"], "winter_2023-2024");

    console.timeEnd("Running generation");
};

main();
