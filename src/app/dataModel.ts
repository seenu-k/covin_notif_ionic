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

export type FeeTypePreference = 'Free' | 'Paid' | 'Any';
export type VaccinePreference = 'COVISHIELD' | 'COVAXIN' | 'ANY';
export type MinAgeLimitPreference = 18 | 45;
