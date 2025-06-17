import { Router } from 'express';
import { getCached, setCache } from '../services/cacheService.js';
import fetch from 'node-fetch';
import { mockAuth } from '../middlewares/auth.js';

const router = Router();
router.use(mockAuth);

const TTL_SECONDS = 3600;

async function verifyImageViaGemini(imageUrl) {
  // This is a stub; integrate real Gemini Vision API.
  return {
    url: imageUrl,
    status: 'verified',
    details: 'Image appears authentic based on visual inspection.',
  };
}

router.post('/:id/verify-image', async (req, res) => {
  const { id } = req.params;
  const { image_url } = req.body;
  if (!image_url) return res.status(400).json({ error: 'image_url is required' });
  const cacheKey = `verify-image:${image_url}`;
  let result = await getCached(cacheKey);
  if (!result) {
    result = await verifyImageViaGemini(image_url);
    await setCache(cacheKey, result, TTL_SECONDS);
  }
  // TODO: store verification status in reports table if needed.
  res.json(result);
});

export default router; 