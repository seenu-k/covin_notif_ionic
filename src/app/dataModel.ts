/* eslint-disable @typescript-eslint/naming-convention */
export interface State {
    state_id: number;
    state_name: string;
}

export interface StatesResponse {
    states: State[];
    ttl: number;
}

export interface District {
    state_id?: number;
    district_id: number;
    district_name: string;
}

export interface DistrictResponse {
    districts: District[];
    ttl: number;
}

export type FeeType = 'Free' | 'Paid';
export type Vaccine = 'COVISHIELD' | 'COVAXIN';
export type MinAgeLimit = 18 | 45;
