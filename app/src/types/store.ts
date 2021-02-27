import { Country } from '../types/country';
import { CountryCount } from '../types/country-count';
import { Flight } from '../types/flight';
import { Marker } from './marker';

export interface StoreState {
  datePicked: string; // ISO
  dates: DateInfo[];
  flightDates: FlightDates;
  countries: Country[];
  countryDates: CountryDates;
  selectedMarker: Marker | undefined;
};

export interface DateInfo {
  text: string; // display
  value: string; // ISO
}

export interface FlightDates {
  [key: string]: Flight[];
}

export interface CountryDates {
  [key: string]: CountryCount[];
}
