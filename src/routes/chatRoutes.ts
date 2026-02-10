import { Router } from 'express';
import { chatWithMintSense } from '../controllers/chatController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use((req, res, next) => {
    console.log(`[CHAT ROUTER] Hit: ${req.method} ${req.originalUrl}`);
    next();
});

router.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

router.use(authenticateToken);

router.post('/', (req, res, next) => {
    console.log("[CHAT ROUTER] Handling POST /");
    next();
}, chatWithMintSense);

export default router;
