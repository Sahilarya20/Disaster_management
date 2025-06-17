import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import disasterRoutes from './routes/disasters.js';
import socialMediaRoutes from './routes/socialMedia.js';
import resourceRoutes from './routes/resources.js';
import updateRoutes from './routes/updates.js';
import geocodeRoutes from './routes/geocode.js';
import verificationRoutes from './routes/verification.js';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
  },
});

// Attach io to app for access in routes/controllers
app.set('io', io);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// API Routes
app.use('/disasters', disasterRoutes);
app.use('/disasters', socialMediaRoutes); // nested route inside file
app.use('/disasters', resourceRoutes);
app.use('/disasters', updateRoutes);
app.use('/disasters', verificationRoutes);
app.use('/', geocodeRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'Disaster Response API is running' });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
}); 