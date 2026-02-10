import { Router } from 'express';
import { createGroup, getMyGroups, getGroupDetails, addMember } from '../controllers/groupController';
import { createExpense, getGroupBalances, deleteExpense } from '../controllers/expenseController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

// Group routes
router.post('/', createGroup);
router.get('/', getMyGroups);
router.get('/:id', getGroupDetails);
router.post('/member', addMember);

// Expense routes linked to groups
router.post('/:groupId/expenses', createExpense);
router.get('/:groupId/balances', getGroupBalances);
router.delete('/expenses/:id', deleteExpense);

export default router;
