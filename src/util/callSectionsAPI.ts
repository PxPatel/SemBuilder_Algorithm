import { QUERY_PARAMETERS, SectionAPIResponse } from "../types/api.types";

export const callSectionsAPI = async (
    queryParameters: QUERY_PARAMETERS,
): Promise<SectionAPIResponse> => {
    const apiURL = "https://us-central1-sembuilder-dev.cloudfunctions.net";

    const sectionsEndpoint = "/sections";

    const callURL = new URL(apiURL.concat(sectionsEndpoint));

    Object.entries(queryParameters).forEach(([paramKey, paramValue]) => {
        callURL.searchParams.set(paramKey, paramValue);
    });

    try {
        const apiRes: SectionAPIResponse = await (await fetch(callURL)).json();
        return apiRes;
    } catch (error) {
        console.log(error);
    }
};
