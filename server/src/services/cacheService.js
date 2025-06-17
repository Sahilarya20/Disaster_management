import { supabase } from '../config/supabase.js';

const TABLE_NAME = 'cache';

export async function getCached(key) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('key', key)
    .single();

  if (error) {
    console.error('Cache fetch error:', error.message);
    return null;
  }

  if (!data) return null;

  const now = new Date();
  const expires = new Date(data.expires_at);
  if (expires < now) {
    // expired, delete entry
    await supabase.from(TABLE_NAME).delete().eq('key', key);
    return null;
  }

  return data.value;
}

export async function setCache(key, value, ttlSeconds = 3600) {
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
  const payload = {
    key,
    value,
    expires_at: expiresAt,
  };

  // upsert
  const { error } = await supabase
    .from(TABLE_NAME)
    .upsert(payload, { onConflict: 'key' });

  if (error) console.error('Cache set error:', error.message);
} 