import { Router } from 'express';
import { supabase } from '../config/supabase.js';
import { mockAuth } from '../middlewares/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
router.use(mockAuth);

// Create a disaster
router.post('/', async (req, res) => {
  const { title, location_name, description, tags } = req.body;
  const id = uuidv4();
  const owner_id = req.user.id;

  const payload = {
    id,
    title,
    location_name,
    description,
    tags,
    owner_id,
    created_at: new Date().toISOString(),
    audit_trail: [
      { action: 'create', user_id: owner_id, timestamp: new Date().toISOString() },
    ],
  };

  const { error } = await supabase.from('disasters').insert(payload);
  if (error) return res.status(500).json({ error: error.message });

  // Emit Socket.IO event
  req.app.get('io').emit('disaster_updated', { type: 'create', disaster: payload });

  res.status(201).json(payload);
});

// Get disasters (optionally filter by tag)
router.get('/', async (req, res) => {
  const { tag } = req.query;
  let query = supabase.from('disasters').select('*');
  if (tag) query = query.contains('tags', [tag]);
  const { data, error } = await query;
  if (error) {
    console.error('Supabase error in GET /disasters:', error);
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// Update disaster
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, location_name, description, tags } = req.body;

  // Fetch existing
  const { data: existing, error: fetchErr } = await supabase
    .from('disasters')
    .select('*')
    .eq('id', id)
    .single();
  if (fetchErr) return res.status(404).json({ error: 'Disaster not found' });

  const updatedFields = {
    title: title ?? existing.title,
    location_name: location_name ?? existing.location_name,
    description: description ?? existing.description,
    tags: tags ?? existing.tags,
    audit_trail: [
      ...(existing.audit_trail || []),
      { action: 'update', user_id: req.user.id, timestamp: new Date().toISOString() },
    ],
  };

  const { error } = await supabase.from('disasters').update(updatedFields).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });

  const updated = { ...existing, ...updatedFields };
  req.app.get('io').emit('disaster_updated', { type: 'update', disaster: updated });
  res.json(updated);
});

// Delete disaster
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('disasters').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  req.app.get('io').emit('disaster_updated', { type: 'delete', id });
  res.json({ success: true });
});

export default router; 