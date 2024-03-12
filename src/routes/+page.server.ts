import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types.js";

interface VizColumn {
    aliasIndices: number[];
}
interface VizDataColumn {
    dataType: string;
    dataValues: (number | string)[];
}
type LicenseInfo = {
    licenseUrl: string;
    operatorName: string;
    licenseName: string;
    locationName: string;
    siteName: string;
    vehicleName: string;
};

function vizMapper(cols: VizColumn[], lookup: Map<string, any>, colNum: number, type: string) {
    const aliasIndicies = cols[colNum].aliasIndices;

    if (aliasIndicies.length === 0) {
        return [];
    }

    const lookupTable = lookup.get(type);
    if (!lookupTable) {
        throw new Error(`No lookup table for type: ${type}`);
    }

    return aliasIndicies.map((i) => lookupTable[i]);
}

function parseResponse(responseText: string): Map<string, LicenseInfo[]> {
    let items: { num: number, json: any }[] = [];

    let remaining = responseText;

    do {
        const nextSemicolon = remaining.indexOf(';');
        if (nextSemicolon === -1) {
            return new Map();
        }

        const num = parseInt(remaining.slice(0, nextSemicolon));

        remaining = remaining.slice(nextSemicolon + 1);

        let pos = 0;
        let depth: string[] = [];
        let string = false;
        let escaped = false;
        for (let i = 0; i < remaining.length; i++) {
            const char = remaining[i];
            if (string) {
                if (char === '\\') {
                    escaped = !escaped;
                } else if (escaped) {
                    escaped = false;
                } else if (char === '"' && !escaped) {
                    string = false;
                }
            } else {
                if (char === '"') {
                    string = true;
                } else if (char === '{' || char === '[') {
                    depth = [char, ...depth];
                } else if (char === '}' || char === ']') {
                    // Check for mismatched bracket types
                    if ((char === '}' && depth[0] !== '{') || (char === ']' && depth[0] !== '[')) {
                        console.log('Mismatched brackets, expected', depth[0], 'but got', char);
                        throw new Error('Mismatched brackets');
                    }

                    depth = depth.slice(1);

                    if (depth.length === 0) {
                        pos = i + 1;
                        break;
                    }
                }
            }
        }

        const json = JSON.parse(remaining.slice(0, pos));

        items = [{ num, json }, ...items];

        remaining = remaining.slice(pos);
    } while (remaining.length > 0);

    let dataTables = new Map<string, LicenseInfo[]>();

    for (let i = 0; i < items.length; i++) {
        try {
            if ('secondaryInfo' in items[i].json) {
                const root = items[i].json.secondaryInfo.presModelMap;
                const dataColumns = root.dataDictionary.presModelHolder.genDataDictionaryPresModel.dataSegments['0'].dataColumns as VizDataColumn[];
                const dataLookup = new Map<string, (number | string)[]>(dataColumns.map((d) => [d.dataType, d.dataValues]));

                const presModelMap = root.vizData.presModelHolder.genPresModelMapPresModel.presModelMap;
                for (const tableName in presModelMap) {
                    const columns = presModelMap[tableName].presModelHolder.genVizDataPresModel.paneColumnsData.paneColumnsList[0].vizPaneColumns;

                    const licenseUrls = vizMapper(columns, dataLookup, 1, 'cstring');
                    const operatorNames = vizMapper(columns, dataLookup, 2, 'cstring');
                    //const dates = vizMapper(columns, dataLookup, 3, 'datetime');
                    const licenseNames = vizMapper(columns, dataLookup, 4, 'cstring');
                    const locationName = vizMapper(columns, dataLookup, 5, 'cstring');
                    const siteName = vizMapper(columns, dataLookup, 6, 'cstring');
                    const vehicleName = vizMapper(columns, dataLookup, 7, 'cstring');

                    // Get max length of all arrays
                    const max = Math.max(licenseUrls.length, operatorNames.length, licenseNames.length, locationName.length, siteName.length, vehicleName.length);

                    // Create an array of objects
                    const data: LicenseInfo[] = [];
                    for (let i = 0; i < max; i++) {
                        data.push({
                            licenseUrl: licenseUrls[i],
                            operatorName: operatorNames[i],
                            licenseName: licenseNames[i],
                            locationName: locationName[i],
                            siteName: siteName[i],
                            vehicleName: vehicleName[i],
                        });
                    }

                    dataTables.set(tableName, data);
                }
            }
        } catch (e) { }
    }

    return dataTables;
}

async function fetchTheThing() {
    const View = 'CommercialSpaceTransportation';
    const Workbook = 'LaunchLicenses';
    const SheetID = escape('Launch Licenses ');

    const htmlBaseURL = `https://explore.dot.gov/t/FAA/views/${View}/${Workbook}`;
    const vqlBaseURL = `https://explore.dot.gov/vizql/t/FAA/w/${View}/v/${Workbook}`;

    const initialPageURL = htmlBaseURL + '?%3Aembed=y&%3AisGuestRedirectFromVizportal=y';
    const defaultHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    };

    // Get all Commercial Space Transportation Launch Licenses
    const htmlPage = await fetch(initialPageURL, {
        method: 'GET',
        headers: {
            Accept: 'text/html',
            ...defaultHeaders,
        },
    });
    if (!htmlPage.ok) {
        throw new Error(`Failed to fetch the page: ${htmlPage.status}`);
    }

    // Get the cookie from the response
    const cookies = htmlPage.headers.getSetCookie();
    if (!cookies || cookies.length === 0) {
        throw new Error('No cookie in the response');
    }

    // Get the session ID from the response
    const sessionId = htmlPage.headers.get('X-Session-Id');
    if (!sessionId) {
        throw new Error('No session ID in the response');
    }

    console.log('Session ID:', sessionId);

    const params = new URLSearchParams();
    params.append('worksheetPortSize', '{"w":800,"h":800}');
    params.append('dashboardPortSize', '{"w":800,"h":800}');
    params.append('clientDimension', '{"w":800,"h":800}');
    params.append('renderMapsClientSide', 'true');
    params.append('isBrowserRendering', 'true');
    params.append('browserRenderingThreshold', '100');
    params.append('formatDataValueLocally', 'false');
    params.append('clientNum', '1');
    params.append('navType', 'Reload');
    params.append('navSrc', 'Top');
    params.append('devicePixelRatio', '1.25');
    params.append('clientRenderPixelLimit', '16000000');
    params.append('allowAutogenWorksheetPhoneLayouts', 'true');
    params.append('sheet_id', SheetID);
    params.append('showParams', '{"checkpoint":false,"refresh":false,"refreshUnmodified":false}');
    params.append('stickySessionKey', '{"capabilities":"0500f018","dataserverPermissions":"e08ccc448a9402c3f8ffcb20cf2ca700c5ad74e92451f1f76f06b1397a2fe1a1","featureFlags":"{}","isAuthoring":false,"isOfflineMode":false,"lastUpdatedAt":1709672528257,"unknownParamsHash":"","viewId":16412,"wgSession":"78Dmp3ZSSmKENRN3DV3QJg","workbookId":3687}');
    params.append('filterTileSize', '200');
    params.append('locale', 'en_US');
    params.append('language', 'en');
    params.append('verboseMode', 'false');
    params.append(':session_feature_flags', '{}');
    params.append('keychain_version', '1');
    params.append('can_data_orientation_auto_open', 'false');

    // Fetch info
    const bootstrap = await fetch(`${vqlBaseURL}/bootstrapSession/sessions/${sessionId}?${params}`, {
        method: 'POST',
        headers: {
            Accept: 'text/javascript',
            Cookie: cookies.join('; '),
            Origin: 'https://explore.dot.gov',
            Referer: initialPageURL,
            'X-Tsi-Active-Tab': SheetID,
            ...defaultHeaders,
        },
    });

    if (!bootstrap.ok) {
        throw new Error(`Failed to bootstrap the session: ${bootstrap.status}: ${await bootstrap.text()}`);
    }

    // Get bootstrap json response
    const bootstrapText = await bootstrap.text();

    return parseResponse(bootstrapText).get('Launch Licenses Details') || [];
}

async function fetchTheThingCached(bucket: R2Bucket) {
    const test = await bucket.get('thingy');
    if (test) {
        const data = await test.text();
        const json = JSON.parse(data);

        // Check the date is no older than 2 minutes
        if (Date.now() - json.date < 1000 * 60 * 2) {
            return json.data as LicenseInfo[];
        }
    }

    const data = await fetchTheThing();
    const json = JSON.stringify({ date: Date.now(), data });
    await bucket.put('thingy', JSON.stringify(json));

    return data;
}

export const load: PageServerLoad = async ({ platform, params }) => {
    const bucket = platform?.env?.FAA_STUFF;
    if (!bucket) {
        throw new Error('No bucket');
    }

    return {
        faa_data: await fetchTheThingCached(bucket),
    };
}