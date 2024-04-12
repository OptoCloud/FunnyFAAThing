import type { LicenseInfo } from "./LicenseInfo"

export type LicensesApiResponse = {
    date: number,
    data: LicenseInfo[]
};