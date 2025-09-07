export interface Country {
  id: string;
  name: string;
  code: string;
}

export interface Region {
  id: string;
  name: string;
  countryId: string;
  country?: Country;
}

export interface City {
  id: string;
  name: string;
  regionId: string;
  region?: Region;
}

export interface Location {
  id: string;
  address: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  cityId: string;
  city?: City;
}

export interface GetCountriesRequest {
  // No params for now
}

export interface GetRegionsRequest {
  countryId?: string;
}

export interface GetCitiesRequest {
  regionId?: string;
}

export interface GetLocationsRequest {
  cityId?: string;
}