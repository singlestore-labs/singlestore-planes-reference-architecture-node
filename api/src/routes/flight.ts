import { Request, Response } from 'express';
import Router from 'express-promise-router';
import { DateTime } from 'luxon';
import { Pool } from 'mysql2/promise';
import { getFlightsForDate, getLoadDates } from '../data/flight-repository.js';

const router = Router();


router.get('/', async function(req: Request, res: Response) {
  const db = req.app.locals.db as Pool;
  const dates = await getLoadDates(db);
  res.json(dates);
});

router.get('/:load_date', async function(req: Request, res: Response) {
  const { load_date } = req.params;
  if (!load_date) {
    return res.status(404).end();
  }
  const date = DateTime.fromISO(load_date);
  if (!date.isValid) {
    return res.status(400).end();
  }
  const db = req.app.locals.db as Pool;
  const flights = await getFlightsForDate(db, date.toJSDate());
  res.json(flights);
});

export default router;
