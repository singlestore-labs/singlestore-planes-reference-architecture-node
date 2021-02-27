import { Pool, RowDataPacket } from 'mysql2/promise';
import { Country } from '../types/country';
import { CountryCount } from '../types/country-count';

export async function getAll(db: Pool): Promise<Country[]> {
  const [results] = await db.query<RowDataPacket[]>('select distinct name from countries group by name order by name');
  return results as Country[];
}

export async function getFlightCounts(db: Pool, date: Date): Promise<CountryCount[]> {
  const [data] = await db.query<RowDataPacket[]>(
    `with flightcountries as (
      select c.name
      from flights f
      inner join countries c on GEOGRAPHY_CONTAINS(c.boundary, f.position)
      where f.load_date = ?
    ), flightcounts as (
      select distinct(name), sum(1) as count
      from flightcountries
      group by name
    ), countrynames as (
      select distinct c.name
      from countries c
      group by c.name
    )
    select c.name, coalesce(f.count, 0) as count
    from countrynames c
    left outer join flightcounts f on c.name = f.name
    order by c.name;`,
    [date]
  );
  const results: CountryCount[] = data.map(d => ({
    name: d.name,
    count: +d.count
  }));
  return results;
}
