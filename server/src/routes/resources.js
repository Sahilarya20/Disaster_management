import { Router } from 'express';
import { supabase } from '../config/supabase.js';
import { mockAuth } from '../middlewares/auth.js';

const router = Router();
router.use(mockAuth);

// GET /disasters/:id/resources?lat=...&lon=...
router.get('/:id/resources', async (req, res) => {
  const { id } = req.params;
  const { lat, lon } = req.query;
  const radiusMeters = 10000; // 10 km

  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon query params required' });

  // Geospatial query using PostGIS ST_DWithin
  const { data, error } = await supabase
    .rpc('resources_within_radius', {
      disaster_id_param: id,
      lat_param: parseFloat(lat),
      lon_param: parseFloat(lon),
      radius_m: radiusMeters,
    });

  if (error) return res.status(500).json({ error: error.message });

  // Broadcast via socket
  req.app.get('io').emit('resources_updated', { disaster_id: id, data });

  res.json(data);
});

export default router; 