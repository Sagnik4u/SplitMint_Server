import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

import authRoutes from './routes/authRoutes';
import groupRoutes from './routes/groupRoutes';
import chatRoutes from './routes/chatRoutes';

console.log("Registering routes...");
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
console.log("Registering chat route...");
console.log("chatRoutes type:", typeof chatRoutes);
app.use('/api/chat', chatRoutes);
console.log("Routes registered.");

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use((req, res, next) => {
    console.log(`[404] Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
