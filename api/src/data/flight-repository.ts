import { Pool, RowDataPacket } from 'mysql2/promise';
import { Flight } from '../types/flight';

export async function getLoadDates(db: Pool): Promise<string[]> {
  const [results] = await db.query<RowDataPacket[]>('select distinct(load_date) from flights group by load_date order by load_date desc limit 20');
  const dates = results.map(r => r.load_date);
  return dates;
}

export async function getFlightsForDate(db: Pool, load_date: Date): Promise<Flight[]> {
  const [results] = await db.query<RowDataPacket[]>('select f.load_date, f.ica024, f.callsign, f.origin_country, f.time_position, f.last_contact, f.longitude, f.latitude, f.baro_altitude, f.on_ground, f.velocity, f.true_track, f.vertical_rate, f.altitude, f.squawk, f.spi, f.position_source, c.name as current_country from flights f left outer join countries c on GEOGRAPHY_CONTAINS(c.boundary, f.position) where f.load_date = ? order by callsign', [load_date]);
  return results as Flight[];
}
