import { VercelRequest, VercelResponse } from '@vercel/node';
import questions from '../src/data/questions.json';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { moduleId, level } = req.query;
  let result = questions;

  if (moduleId) {
    result = (result as any[]).filter(q => q.moduleId === moduleId);
  }
  if (level) {
    result = (result as any[]).filter(q => q.level === level);
  }

  res.status(200).json({ questions: result });
}
