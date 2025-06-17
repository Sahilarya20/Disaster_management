import { Router } from 'express';
import fetch from 'node-fetch';
import { getCached, setCache } from '../services/cacheService.js';

const router = Router();
const TTL_SECONDS = 3600;

async function extractLocationWithGemini(text) {
  // TODO: Call Gemini API; for now, return text as-is.
  return text;
}

async function geocodeWithNominatim(locationName) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'disaster-response-app/1.0 (contact@example.com)'
    }
  });
  const json = await response.json();
  if (json.length === 0) throw new Error('Location not found');
  const { lat, lon } = json[0];
  return { lat: parseFloat(lat), lon: parseFloat(lon) };
}

router.post('/geocode', async (req, res) => {
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: 'description is required' });

  const cacheKey = `geocode:${description}`;
  let data = await getCached(cacheKey);
  if (data) return res.json({ cached: true, ...data });

  try {
    const locationName = await extractLocationWithGemini(description);
    const coords = await geocodeWithNominatim(locationName);

    data = { location_name: locationName, coords };
    await setCache(cacheKey, data, TTL_SECONDS);
    res.json({ cached: false, ...data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router; 