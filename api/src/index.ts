import dotenv from 'dotenv';
import http from 'http';
import { createPool, ConnectionOptions, Pool } from 'mysql2/promise';
import app from './app.js';

dotenv.config();

const port = process.env.PORT || 3000;
app.set('port', port);

const dbConfig: ConnectionOptions = {
  host: process.env.SINGLESTORE_HOST,
  user: process.env.SINGLESTORE_USER,
  password: process.env.SINGLESTORE_PASSWORD,
  database: 'maps'
};
const db: Pool = await createPool(dbConfig);
app.locals.db = db;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`listening on http://+:${port}`);
}).on('error', err => {
  console.log(`Error starting on ${port}`, {err});
  process.exit(1);
});
