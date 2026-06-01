import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const { rows } = await db.query('SELECT * FROM progress ORDER BY answered_at DESC');
      const progressMap: Record<string, any> = {};
      rows.forEach((row: any) => {
        progressMap[row.question_id] = {
          questionId: row.question_id,
          status: row.status,
          answer: row.answer,
          attempts: row.attempts,
          answeredAt: new Date(row.answered_at).getTime(),
        };
      });
      res.status(200).json({ progress: { answers: progressMap, initialized: true, xp: 0, lastActive: Date.now() } });
    } catch (error) {
      // If table doesn't exist yet, return empty progress
      res.status(200).json({ progress: { answers: {}, initialized: false, xp: 0, lastActive: Date.now() } });
    }
  } else if (req.method === 'POST') {
    try {
      const { questionId, status, answer } = req.body;
      await db.query(
        `INSERT INTO progress (question_id, status, answer, attempts)
         VALUES ($1, $2, $3, 1)
         ON CONFLICT (question_id)
         DO UPDATE SET status = $2, answer = $3, attempts = progress.attempts + 1, answered_at = NOW()`,
        [questionId, status, JSON.stringify(answer)]
      );
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save progress' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
