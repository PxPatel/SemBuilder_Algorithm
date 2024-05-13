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

console.log("Triggering :)");

//To control program during tsc -w and nodemon scripts
const mainflag = true;

const main = async () => {
    const sectionFilters: SelectedSections = {
        // CS114: ["002", "004"],
        // ENGL102: ["089"],
        // IS350: ["102"],
        // MATH337: ["002"],
        // YWCC207: ["004"],
    };
    const unwantedDay: Day[] = [];
    const timeFilters: TimeOptions = {
        before: 50000000,
        after: 100000000,
    };

    await generateFilteredSchedules(sectionFilters, unwantedDay, timeFilters);
};

// export function filterFunctionalSchedules(
//     scheduleCombinations: Schedule[],
// ): Schedule[] {
//     return scheduleCombinations.filter(
//         schedule =>
//             schedule.X.length === 0 &&
//             schedule.M.length === 3 &&
//             schedule.T.length === 2 &&
//             schedule.W.length === 1 &&
//             schedule.R.length === 4 &&
//             schedule.F.length === 0 &&
//             schedule.M.includes("Spring2024_YWCC207-004") &&
//             schedule.M.includes("Spring2024_ENGL102-089") &&
//             schedule.M.includes("Spring2024_CS114-004"),
//         // schedule.W.includes("Spring2024_ENGL102-089"),
//         // schedule.T.includes("Spring2024_MATH337-002") &&
//         // schedule.T.includes("Spring2024_FIN315-004"),
//     );
// }

mainflag && main();
