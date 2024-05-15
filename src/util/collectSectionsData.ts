import { CompiledCoursesData, SectionAPIResponse } from "../types/api.types";
import { callSectionsAPI } from "./callSectionsAPI";

//TODO:Currently hard-coded, but intending to create a more comprehensive mechanism
//to change semester automatically based on latest semester available via API
const SEMESTER = "Spring_2024";

const getSectionsForAllCourses = async (
    courseTitleArray: string[],
    semesterTitle?: string,
) => {
    const promises = [];

    for (let i = 0; i < courseTitleArray.length; ++i) {
        promises.push(
            callSectionsAPI({
                semester: semesterTitle ?? SEMESTER,
                course: courseTitleArray[i],
            }),
        );
    }

    const res = await Promise.all(promises);
    return res;
};

const mapCoursesToSections = (sectionsForAllCourses: SectionAPIResponse[]) => {
    const courseSectionsMap: CompiledCoursesData = {};

    for (const sectionsForCourse of sectionsForAllCourses) {
        if (sectionsForCourse.item_count !== 0) {
            const courseTitle =
                sectionsForCourse.data[0].course_semester_info.course_semester_id.split(
                    "_",
                )[1];

            courseSectionsMap[courseTitle] = {};
            for (const sectionData of sectionsForCourse.data) {
                courseSectionsMap[courseTitle][sectionData.section_number] =
                    sectionData;
            }
        }
    }
    return courseSectionsMap;
};

export const collectSectionsData = async (
    courseTitleArray: string[],
    semesterTitle?: string,
): Promise<CompiledCoursesData> => {
    //Defensive argument check
    if (courseTitleArray.length === 0 || courseTitleArray === null) {
        return {};
    }

    //Get API responses in array
    const sectionsForAllCourses = await getSectionsForAllCourses(
        courseTitleArray,
        semesterTitle,
    );

    //Organize responses to map course to its data from API
    const collectedSections: CompiledCoursesData = mapCoursesToSections(
        sectionsForAllCourses,
    );

    //Validate if all courses exist, otherwise throw error
    const keysOfCollectedSections = Object.keys(collectedSections);
    if (keysOfCollectedSections.length != courseTitleArray.length) {
        const invalidCourses = courseTitleArray.filter(
            courseTitle =>
                !keysOfCollectedSections.includes(courseTitle.toUpperCase()),
        );
        throw new Error(
            `The following courses do not exist in the semester catalog: ${invalidCourses}`,
        );
    }

    //Return map
    return collectedSections;
};
