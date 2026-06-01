import { VercelRequest, VercelResponse } from '@vercel/node';
import modules from '../src/data/modules.json';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ modules });
}
