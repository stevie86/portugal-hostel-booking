import { prisma } from '../../prisma';
import { Country, Region, City, Location, GetCountriesRequest, GetRegionsRequest, GetCitiesRequest, GetLocationsRequest } from './types';

export class LocalizationService {
  static async getCountries(request: GetCountriesRequest = {}): Promise<Country[]> {
    const countries = await prisma.country.findMany({
      orderBy: { name: 'asc' }
    });

    return countries;
  }

  static async getCountryById(id: string): Promise<Country | null> {
    const country = await prisma.country.findUnique({
      where: { id }
    });

    return country;
  }

  static async getRegions(request: GetRegionsRequest = {}): Promise<Region[]> {
    const { countryId } = request;

    const regions = await prisma.region.findMany({
      where: countryId ? { countryId } : {},
      include: { country: true },
      orderBy: { name: 'asc' }
    });

    return regions;
  }

  static async getRegionById(id: string): Promise<Region | null> {
    const region = await prisma.region.findUnique({
      where: { id },
      include: { country: true }
    });

    return region;
  }

  static async getCities(request: GetCitiesRequest = {}): Promise<City[]> {
    const { regionId } = request;

    const cities = await prisma.city.findMany({
      where: regionId ? { regionId } : {},
      include: { region: true },
      orderBy: { name: 'asc' }
    });

    return cities;
  }

  static async getCityById(id: string): Promise<City | null> {
    const city = await prisma.city.findUnique({
      where: { id },
      include: { region: true }
    });

    return city;
  }

  static async getLocations(request: GetLocationsRequest = {}): Promise<Location[]> {
    const { cityId } = request;

    const locations = await prisma.location.findMany({
      where: cityId ? { cityId } : {},
      include: { city: true },
      orderBy: { address: 'asc' }
    });

    return locations;
  }

  static async getLocationById(id: string): Promise<Location | null> {
    const location = await prisma.location.findUnique({
      where: { id },
      include: { city: true }
    });

    return location;
  }
}