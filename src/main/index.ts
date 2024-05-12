/**
 * Steps:
 * 1. Algorithm will take input from a user, regarding which courses are indented to be taken
 * 2. A callAPI function will call the API for the sections, using the /api/sections endpoint
 */

import { Day } from "../types/api.types";
import { Schedule } from "../types/schedule.types";
import { Filters } from "../util/generationAlgos/filterSectionsByNumber";
import { generateFilteredSchedules } from "../util/generateFilteredSchedules";

const inputObject = [
    "CS114",
    "ENGL102",
    "IS350",
    "YWCC207",
    "MATH337",
    "FIN315",
];

//To control program during tsc -w and nodemon scripts
const mainflag = true;

const main = async () => {
    const sectionFilters: Filters = {};
    const unwantedDay: Day[] = ["M", "W", "F"];

    await generateFilteredSchedules(sectionFilters, unwantedDay);
};

export function filterFunctionalSchedules(
    scheduleCombinations: Schedule[],
): Schedule[] {
    return scheduleCombinations.filter(
        schedule =>
            schedule.X.length === 0 &&
            schedule.M.length === 3 &&
            schedule.T.length === 2 &&
            schedule.W.length === 1 &&
            schedule.R.length === 4 &&
            schedule.F.length === 0 &&
            schedule.M.includes("Spring2024_YWCC207-004") &&
            schedule.M.includes("Spring2024_ENGL102-089") &&
            schedule.M.includes("Spring2024_CS114-004"),
        // schedule.W.includes("Spring2024_ENGL102-089"),
        // schedule.T.includes("Spring2024_MATH337-002") &&
        // schedule.T.includes("Spring2024_FIN315-004"),
    );
}

mainflag && main();
