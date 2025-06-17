import { Router } from 'express';
import { getCached, setCache } from '../services/cacheService.js';
import fetch from 'node-fetch';
import { mockAuth } from '../middlewares/auth.js';

const router = Router();
router.use(mockAuth);

const TTL_SECONDS = 3600;

async function fetchOfficialUpdates() {
  // TODO: Replace with actual scraping of FEMA/Red Cross.
  return [
    { title: 'FEMA Update', link: 'https://www.fema.gov', summary: 'Stay indoors' },
  ];
}

router.get('/:id/official-updates', async (req, res) => {
  const { id } = req.params;
  const cacheKey = `official-updates:${id}`;
  let data = await getCached(cacheKey);
  if (data) return res.json({ cached: true, data });
  data = await fetchOfficialUpdates();
  await setCache(cacheKey, data, TTL_SECONDS);
  res.json({ cached: false, data });
});

export default router; 