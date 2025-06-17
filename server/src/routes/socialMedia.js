import { Router } from 'express';
import { getCached, setCache } from '../services/cacheService.js';
import { mockAuth } from '../middlewares/auth.js';
import fetch from 'node-fetch';

const router = Router();
router.use(mockAuth);

// Constants
const TTL_SECONDS = 3600;

async function fetchMockSocialMedia(disaster) {
  // This function would call Twitter/Bluesky APIs. For now, returns mock data.
  return [
    { post: `#${disaster.tags?.[0] || 'disaster'} Stay safe in ${disaster.location_name}`, user: 'citizen1' },
    { post: `Need help in ${disaster.location_name}`, user: 'citizen2' },
  ];
}

router.get('/:id/social-media', async (req, res) => {
  const { id } = req.params;
  const cacheKey = `social-media:${id}`;

  // Try cache first
  let data = await getCached(cacheKey);
  if (data) {
    return res.json({ cached: true, data });
  }

  // Fetch disaster info (assuming DB fetch via Supabase REST)
  const disasterRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/disasters?id=eq.${id}`, {
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
    },
  });
  const disasterArr = await disasterRes.json();
  const disaster = disasterArr[0];
  if (!disaster) return res.status(404).json({ error: 'Disaster not found' });

  data = await fetchMockSocialMedia(disaster);

  await setCache(cacheKey, data, TTL_SECONDS);
  req.app.get('io').emit('social_media_updated', { disaster_id: id, data });
  res.json({ cached: false, data });
});

export default router; 