import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../db';
import modules from '../../src/data/modules.json';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { rows } = await db.query(`
      SELECT p.question_id, p.status, q.module_id
      FROM progress p
      JOIN questions q ON p.question_id = q.id
    `);

    const stats: Record<string, { total: number; completed: number; correct: number }> = {};

    (modules as any[]).forEach((mod: any) => {
      stats[mod.id] = { total: 0, completed: 0, correct: 0 };
    });

    rows.forEach((row: any) => {
      const modId = row.module_id;
      if (!stats[modId]) stats[modId] = { total: 0, completed: 0, correct: 0 };
      stats[modId].total++;
      if (row.status !== 'pending') stats[modId].completed++;
      if (row.status === 'correct') stats[modId].correct++;
    });

    // Calculate scores
    Object.keys(stats).forEach((key) => {
      const s = stats[key];
      s.total = s.completed; // total answered in this module
      const mod = (modules as any[]).find((m: any) => m.id === key);
      if (mod) s.total = mod.questionCount;
      s.score = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
    });

    res.status(200).json({ stats });
  } catch (error) {
    res.status(200).json({ stats: {} });
  }
}
