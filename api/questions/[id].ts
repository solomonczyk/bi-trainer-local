import { VercelRequest, VercelResponse } from '@vercel/node';
import questions from '../../src/data/questions.json';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const question = (questions as any[]).find(q => q.id === id);

  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  res.status(200).json({ question });
}
