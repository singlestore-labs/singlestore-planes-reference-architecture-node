import { Request, Response } from 'express';
import Router from 'express-promise-router';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const router = Router();


const __dirname = dirname(fileURLToPath(import.meta.url));
const indexPath = join(__dirname, '../../public', 'index.html');

router.get('/', function(req: Request, res: Response) {
  res.sendFile(indexPath);
});

export default router;
