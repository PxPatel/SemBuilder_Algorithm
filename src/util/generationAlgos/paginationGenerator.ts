/**
 * So since an entire list of schedules is not feasibly to store, a pagination mechanism will be implemented
 * Each call will generate x number more schedules to be presented. This saves computation effort and memory
 * The recursive program will continue until a certain array length is achieved and then dismantle the stack
 *
 * To call for more generation, a new methodology must be designed. Online research for help.
 *
 * Current thoughts are more parameter guided recursion. From the last input, the function will also output
 * an object detailing an image of the stack.
 *
 * Using the details, the for loops in each recursive call will start at a particular section
 * and then continue on from that initial point, thereby skipping already explored paths
 *
 * The lastPointDetails object will contain the sectionNumber for the last section that was explored for each course
 * If the object is not provided, the algorithm will generate from a default initial point at the start of the lists
 *
 * The keep order consistent, the for loop will explore sections in increasing order of the sectionNumber
 *
 * For setting the initial points, we will want to keep a consistent order for many things.
 * Firstly the order of course exploring is set to be in alphabetical
 * We must assume that the LPD is not ordered, so that manipulation can be allowed in the future.
 * As the first recursive stack is formed, first iterate through the LPD to see if the course can be found
 * If it can't, continue from beginning of all sections.
 * If it can, get the section number, get index of that section number in sortedSections.[course] and start from there
 * To handle the set-off, if sectionNumber is found, check if dataKeyIndex is last index
 * If last index, set the index for that particular to index + 1
 *
 * TODO: Fix the ReportingSchedule and output so that a schedule has another field: simplied
 * It is essentially a string[] that lists the sections that are in the schedule
 *
 * TODO: Have it so that relevantCoursesData doesnt have duplicate courseTitles
 * This can be implemented in the front end validation, where logic checks for duplicates
 * Or this can be done internally as part of paginationGenerator, or a previously called
 * function that defensively checks parameters of paginationGeneration before calling it
 * Obv each solution is valid is similar in implementation. I prefer to do this with both front end
 * input validation and with parameter safe-guards for better quality control and testing
 */

import {
    CompiledCoursesData,
    DeepClone,
    SectionData,
    DayType,
} from "../../types/api.types";
import {
    LastPointDetails,
    ReportSchedules,
    Schedule,
} from "../../types/schedule.types";

export type GenerationOptions = {
    lastPointDetails?: LastPointDetails;
    generateAmount?: number;
    allowIncompleteSections?: boolean;
};

const DEFAULT_GENERATION_AMOUNT = 25;

/**
 *
 * @param relevantCoursesData Organized data of courses and their sections
 * @param lastPointDetails [Optional] Sections in last generated schedule
 * @param generateAmount [Optional] Number of schedules to generate
 * @returns Array with generated schedules and new last point details
 */
export function paginationGenerator(
    courseSectionsMap: CompiledCoursesData,
    generationOptions: GenerationOptions = {},
): [ReportSchedules, LastPointDetails] {
    const { lastPointDetails, generateAmount, allowIncompleteSections } =
        generationOptions;

    if (lastPointDetails === null) {
        return [[], null];
    }

    if (
        typeof generateAmount !== "undefined" &&
        (generateAmount === null || typeof generateAmount !== "number")
    ) {
        throw new Error(
            `Value for 'generateAmount' parameter is not valid: ${generateAmount}`,
        );
    }

    if (
        typeof allowIncompleteSections !== "undefined" &&
        (allowIncompleteSections === null ||
            typeof allowIncompleteSections !== "boolean")
    ) {
        throw new Error(
            "'allowIncompleteSections' parameter must be a boolean value",
        );
    }

    if (
        typeof lastPointDetails !== "undefined" &&
        areDuplicatesInLPD(lastPointDetails)
    ) {
        throw new Error(
            `Last Point Details has a duplicate course: ${lastPointDetails}`,
        );
    }

    const LPD = typeof lastPointDetails === "undefined" ? [] : lastPointDetails;

    const generateNum = generateAmount
        ? generateAmount
        : DEFAULT_GENERATION_AMOUNT;

    const generatedSchedules: ReportSchedules = [];
    const currentSchedule: Schedule = {
        M: [],
        T: [],
        W: [],
        R: [],
        F: [],
        S: [],
        X: [],
    };
    const courseTitleArray = sortCoursesByTitle(Object.keys(courseSectionsMap));
    const sortedSectionsMap = sortSectionsForCourses(courseSectionsMap);

    const [, newLDP] = auxPaginationGenerator(
        courseSectionsMap,
        courseTitleArray,
        0,
        currentSchedule,
        sortedSectionsMap,
        LPD,
        generateNum,
        generatedSchedules,
        allowIncompleteSections ? allowIncompleteSections : false,
    );

    return [generatedSchedules, newLDP];
}

export function auxPaginationGenerator(
    courseSectionsMap: CompiledCoursesData,
    courseTitleArray: string[],
    keyIndex: number,
    currentSchedule: Schedule,
    sortedSectionsMap: { [key: string]: string[] },
    lastPointDetails: LastPointDetails,
    generateNum: number,
    generatedSchedules: ReportSchedules,
    allowIncompleteSections: boolean,
): [boolean, LastPointDetails] {
    //If no more courses to explore
    //Push the currentSchedule to the results
    //After pushing, if the results reach a limit, return true and the LPD
    if (courseTitleArray.length === keyIndex) {
        generatedSchedules.push(deepCloneObject(currentSchedule));
        // generatedSchedules.push(simplySchedule(currentSchedule));

        if (generatedSchedules.length === generateNum) {
            return [true, simplySchedule(currentSchedule)];
        }
        return [false, null];
    }

    const selectedCourseTitle = courseTitleArray[keyIndex];
    const sectionsOfSelectedCourse = sortedSectionsMap[selectedCourseTitle];
    const countOfSectionsOfSelectedCourse = sectionsOfSelectedCourse.length;

    //If a course has no sections to explore, end the
    if (countOfSectionsOfSelectedCourse === 0) {
        return [true, null];
    }

    const initialStartingPoint = getInitiatingIndexFromLPD(
        selectedCourseTitle,
        sectionsOfSelectedCourse,
        lastPointDetails,
        keyIndex,
        courseTitleArray.length,
    );

    for (
        let i = initialStartingPoint;
        i < countOfSectionsOfSelectedCourse;
        i++
    ) {
        const sectionNumber = sectionsOfSelectedCourse[i];

        //Can perhaps consider an inline filtering of sections

        if (
            !doesScheduleHaveConflict(
                courseSectionsMap[selectedCourseTitle][sectionNumber],
                currentSchedule,
                courseSectionsMap,
                allowIncompleteSections,
            )
        ) {
            const daysOfSection =
                courseSectionsMap[selectedCourseTitle][sectionNumber].days;
            const updatedSchedule = deepCloneObject(currentSchedule);
            for (const day of daysOfSection) {
                updatedSchedule[day].push(
                    courseSectionsMap[selectedCourseTitle][sectionNumber]
                        .section_id,
                );
            }

            const [isFinished, newLDP] = auxPaginationGenerator(
                courseSectionsMap,
                courseTitleArray,
                keyIndex + 1,
                updatedSchedule,
                sortedSectionsMap,
                lastPointDetails,
                generateNum,
                generatedSchedules,
                allowIncompleteSections,
            );

            if (isFinished) {
                return [isFinished, newLDP];
            }
        }
    }

    return [false, null];
}

export function getInitiatingIndexFromLPD(
    selectedCourseTitle: string,
    sectionsOfSelectedCourse: string[],
    lastPointDetails: LastPointDetails,
    keyIndex: number,
    dataKeysLength: number,
): any {
    let initialStartingPoint = 0;

    for (const sectionIdentity of lastPointDetails) {
        const [courseTitleLPD, sectionNumberLPD] = sectionIdentity.split("-");
        if (selectedCourseTitle === courseTitleLPD) {
            const indexInSortedArray =
                sectionsOfSelectedCourse.indexOf(sectionNumberLPD);

            //If section is valid and is found in the sortedArray
            //Set as the initiating point for for-loop
            if (indexInSortedArray !== -1) {
                initialStartingPoint = indexInSortedArray;

                //If exploring the last course, initiate for-loop
                //on the next section from the LPD
                if (keyIndex === dataKeysLength - 1) {
                    initialStartingPoint++;
                    lastPointDetails = [];
                }
            }
        }
    }

    return initialStartingPoint;
}

export function sortSectionsForCourses(data: CompiledCoursesData): {
    [key: string]: string[];
} {
    const sortedResult: { [key: string]: string[] } = {};
    Object.keys(data).forEach(courseTitle => {
        const sortedSectionsArray = Object.keys(data[courseTitle]).sort(
            compareSectionNumber,
        );

        sortedResult[courseTitle] = sortedSectionsArray;
    });

    return sortedResult;
}

export function compareSectionNumber(a: string, b: string): number {
    const isANumeric = /^\d+$/.test(a);
    const isBNumeric = /^\d+$/.test(b);

    // If both are purely numerical, compare them as numbers
    if (isANumeric && isBNumeric) {
        return parseInt(a) - parseInt(b);
    }

    // If both are hybrid or both are non-numeric, compare them as strings
    if (!isANumeric && !isBNumeric) {
        return a.localeCompare(b);
    }

    // Numeric strings come before hybrid strings
    return isANumeric ? -1 : 1;
}

export function areDuplicatesInLPD(LPD: string[]): boolean {
    const set = new Set<string>();

    for (const sectionIdentity of LPD) {
        const courseTitle = sectionIdentity.split("-")[0];

        if (set.has(courseTitle)) {
            return true;
        } else {
            set.add(courseTitle);
        }
    }

    return false;
}

//TODO: Make sure it considers duplicate departments
//And sorts by the courseNumber after that
export function sortCoursesByTitle(courseTitleArray: string[]): string[] {
    return courseTitleArray.sort((a, b) => a.localeCompare(b));
}

export function simplySchedule(currentSchedule: Schedule): string[] {
    const set = new Set<string>();

    for (const day of Object.keys(currentSchedule)) {
        const sectionsTakenOnDay = currentSchedule[<DayType>day];
        sectionsTakenOnDay.forEach(sectionId => {
            const sectionIdentity = sectionId.split("_")[1];
            if (!set.has(sectionIdentity)) {
                set.add(sectionIdentity);
            }
        });
    }

    return [...set.values()];
}

function doesScheduleHaveConflict(
    sectionDataInQ: SectionData,
    currentSchedule: Schedule,
    data: CompiledCoursesData,
    allowIncompleteSections: boolean,
): boolean {
    if (sectionDataInQ === null) {
        throw Error("No section data provided");
    }

    if (
        sectionDataInQ.days.length === 0 ||
        sectionDataInQ.status.toUpperCase() === "CANCELLED"
    ) {
        return true;
    }

    if (!allowIncompleteSections && sectionDataInQ.days.includes("X")) {
        return true;
    }

    for (const day of sectionDataInQ.days) {
        if (day === "X" && allowIncompleteSections) {
            continue;
        }

        //Iterate through the section_ids of the sections
        //currently in currSchedule for a particular day
        for (const section_id of currentSchedule[day]) {
            //Decompose the courseName, and sectionNumber from id
            const [, courseName, sectionNumber] =
                getSectionMetaDataFromSectionID(section_id);

            //Get the "dayIndex" of the selectedDay in the days array
            //of the traversing section
            const matchIndex =
                data[courseName][sectionNumber].days.indexOf(day);
            //With the matchingIndex, find the corresponding start and end time of the section
            //for the particular day
            const startTimeOfOne =
                data[courseName][sectionNumber].start_times[matchIndex];
            const endTimeOfOne =
                data[courseName][sectionNumber].end_times[matchIndex];

            const startTimeInQ =
                sectionDataInQ.start_times[sectionDataInQ.days.indexOf(day)];

            const endTimeInQ =
                sectionDataInQ.end_times[sectionDataInQ.days.indexOf(day)];

            // const foo = data[courseName][sectionNumber]

            if (
                startTimeInQ === null ||
                endTimeInQ === null ||
                startTimeOfOne === null ||
                endTimeOfOne === null
            ) {
                if (allowIncompleteSections) {
                    continue;
                } else {
                    return true;
                }
            }

            //If the start or end time of the selectedSection is inbetween
            //the times of the traversing section
            //return true to report the conflict
            if (
                isTimeInBetweenInterval(
                    startTimeInQ,
                    startTimeOfOne,
                    endTimeOfOne,
                ) ||
                isTimeInBetweenInterval(
                    endTimeInQ,
                    startTimeOfOne,
                    endTimeOfOne,
                )
            ) {
                return true;
            }
        }
    }

    //If the selectedSection passes through all the traversings section
    //then there is no conflict and thus return false
    return false;
}

function getSectionMetaDataFromSectionID(
    sectionId: string,
): [string, string, string] {
    const [semesterTitle, sectionIdentity] = sectionId.split("_");
    const [courseTitle, sectionNumber] = sectionIdentity.split("-");

    return [semesterTitle, courseTitle, sectionNumber];
}

function isTimeInBetweenInterval(
    x: number,
    earlierBound: number,
    laterBound: number,
): boolean {
    if (x === null) {
        throw Error("Not a valid value for 'x'");
    }

    return x >= earlierBound && x <= laterBound;
}

export function deepCloneObject<T>(obj: T): DeepClone<T> {
    return JSON.parse(JSON.stringify(obj));
}
