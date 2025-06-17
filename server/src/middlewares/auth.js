const users = {
  netrunnerX: { id: 'netrunnerX', role: 'admin' },
  reliefAdmin: { id: 'reliefAdmin', role: 'admin' },
  contributor1: { id: 'contributor1', role: 'contributor' },
};

export function mockAuth(req, res, next) {
  // In real world, use JWT. Here, accept `x-user-id` header.
  const userId = req.headers['x-user-id'] || 'netrunnerX';
  req.user = users[userId] || users['netrunnerX'];
  next();
} 