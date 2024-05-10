/**
 * Steps:
 * 1. Algorithm will take input from a user, regarding which courses are indented to be taken
 * 2. A callAPI function will call the API for the sections, using the /api/sections endpoint
 */

import { Schedule } from "../types/schedule.types";
import { collectSectionsData } from "../util/collectSectionsData";
import { paginationGenerator } from "../util/generationAlgos/paginationGenerator";
import { scheduleGenerator } from "../util/generationAlgos/scheduleGenerator";
import { writeFileSync, readFileSync } from "fs";

const inputObject = [
    "CS114",
    "ENGL102",
    "IS350",
    "YWCC207",
    "MATH337",
    "FIN315",
];

const mainflag = true;

const main = async () => {
    try {
        // const relevantCourseData = await collectSectionsData(inputObject);
        const relevantCoursesData = await JSON.parse(
            readFileSync(
                "C:\\Users\\laugh\\Downloads\\SemBuilder_Algo\\src\\logs\\data.json",
                "utf-8",
            ),
        );

        // writeFileSync(
        //     "C:\\Users\\laugh\\Downloads\\SemBuilder_Algo\\src\\logs\\data.json",
        //     JSON.stringify(relevantCourseData),
        // );

        console.log(Object.keys(relevantCoursesData));
        const keys = Object.keys(relevantCoursesData);
        for (const key of keys) {
            const ob = relevantCoursesData[key];
            console.log(Object.keys(ob).length);
        }

        console.time("HELL");

        const flag = true;
        let ans;
        if (flag) {
            console.log("Hello");
            ans = paginationGenerator(relevantCoursesData, [], 100);
            console.log(ans[1]);
            console.log(ans[0].length);

            const ans2 = paginationGenerator(relevantCoursesData, ans[1]);
            console.log(ans2[0].length);

            // writeFileSync(
            //     "C:\\Users\\laugh\\Downloads\\SemBuilder_Algo\\src\\logs\\result.json",
            //     JSON.stringify(ans),
            // );

            // writeFileSync(
            //     "C:\\Users\\laugh\\Downloads\\SemBuilder_Algo\\src\\logs\\result2.json",
            //     JSON.stringify(ans2),
            // );
        }
        console.timeEnd("HELL");

        if (flag) {
            // const filtered = filterFunctionalSchedules(ans);
            // console.log(filtered.length);
        }
        // writeFileSync(
        //     "C:\\Users\\laugh\\Downloads\\SemBuilder_Algo\\src\\logs\\result.json",
        //     JSON.stringify(filtered),
        // );
    } catch (error) {
        console.log(error);
    }
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
