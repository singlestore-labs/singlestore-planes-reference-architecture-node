import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { DateTime } from 'luxon';
import { Client, ClientOptions } from 'minio';
import { Readable } from 'stream';
import { Flight } from './flight';
import { OpenSkyResponse } from './opensky';

const BUCKET_NAME = 'flights'; // ASSUME: it already exists
dotenv.config();
const S3_CLIENT = getS3Client();


// load every 10 seconds (api caches to 10 seconds on free accounts)
setInterval(loadData, 10000);
loadData();


export default async function loadData(): Promise<void> {
  try {

    const data = await getFlightData();

    const load_date = DateTime.fromSeconds(data.time).toISO();

    const flights = data.states
      .map((d: unknown[]) => pivotData(d, load_date))
      .filter((f: Flight) => f.callsign || f.position);

    // 1 line per object, no array wrapper around it, no comma between objects
    const content = flights.map((f: Flight) => JSON.stringify(f)).join('\n');

    const filename = `${load_date}.json`.replace(/:/g,'-');

    await uploadFileToS3(S3_CLIENT, BUCKET_NAME, filename, content);

    console.log(`uploaded ${filename}`);

  } catch (err) {
    console.log('error loading', {err});
  }
}

export async function getFlightData(): Promise<OpenSkyResponse> {

  // docs: https://opensky-network.org/apidoc/rest.html
  const url = 'https://opensky-network.org/api/states/all';
  const res = await fetch(url, {method: 'GET'});
  const data = await res.json();

  return data;
}

// FRAGILE: the vector array from the service is pretty messy. Sorry for the ts-ignore
export function pivotData(f: unknown[], load_date: string): Flight {
  // @ts-ignore
  const [ica024, callsign, origin_country, time_position_num, last_contact_num, longitude, latitude, baro_altitude, on_ground, velocity, true_track, vertical_rate, sensors, altitude, squawk, spi, position_source] = f;
  const last_contact = DateTime.fromSeconds(last_contact_num as number).toISO();
  const time_position = time_position_num ? DateTime.fromSeconds(time_position_num as number).toISO() : undefined;
  const position = latitude && longitude ? `POINT (${longitude} ${latitude})` : undefined;
  // @ts-ignore
  const flt: Flight = {load_date, ica024, callsign: (callsign || '').trim(), origin_country, time_position, last_contact, longitude, latitude, position, baro_altitude, on_ground, velocity, true_track, vertical_rate, sensors, altitude, squawk, spi, position_source};
  return flt;
}

export function getS3Client(): Client {
  const config: ClientOptions = {
    endPoint: process.env.S3_ENDPOINT || 's3.amazonaws.com',
    port: process.env.S3_PORT ? parseInt(process.env.S3_PORT, 10) : undefined,
    useSSL: process.env.S3_USESSL !== 'false',
    accessKey: process.env.S3_ACCESSKEY || '',
    secretKey: process.env.S3_SECRETKEY || ''
  };
  return new Client(config);
}

async function uploadFileToS3(minioClient: Client, bucketName: string, filename: string, data: string): Promise<string> {
  const metadata = {
    'Content-Type': 'application/json'
  };
  const jsonStream = Readable.from(data);
  const etag = await minioClient.putObject(bucketName, filename, jsonStream, metadata);
  return etag;
}
