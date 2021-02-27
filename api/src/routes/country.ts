import { Request, Response } from 'express';
import Router from 'express-promise-router';
import { DateTime } from 'luxon';
import { Pool } from 'mysql2/promise';
import { getAll, getFlightCounts } from '../data/country-repository.js';

const router = Router();


router.get('/', async function(req: Request, res: Response) {
  const db = req.app.locals.db as Pool;
  const countries = await getAll(db);
  res.json(countries);
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
  const countries = await getFlightCounts(db, date.toJSDate());
  res.json(countries);
});

export default router;
