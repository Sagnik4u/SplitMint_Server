import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { calculateBalances, simplifyDebts } from '../utils/balanceUtils';

const prisma = new PrismaClient();

export const createExpense = async (req: Request, res: Response) => {
    const { groupId, description, amount, splitType, shares } = req.body;
    const payerId = (req as any).user.id;

    // shares: [{ userId, amount }]

    try {
        const expense = await prisma.expense.create({
            data: {
                groupId,
                payerId,
                description,
                amount: parseFloat(amount),
                splitType,
                shares: {
                    create: shares.map((s: any) => ({
                        userId: s.userId,
                        amount: parseFloat(s.amount)
                    }))
                }
            },
            include: { shares: true }
        });
        res.json(expense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create expense' });
    }
};

export const getGroupBalances = async (req: Request, res: Response) => {
    const { groupId } = req.params;

    try {
        const expenses = await prisma.expense.findMany({
            where: { groupId: String(groupId) },
            include: { shares: true }
        });

        // Cast to any to avoid strict type checking on the included relation
        // We know shares are present because of include: { shares: true }
        const netBalances = calculateBalances(expenses as any);
        const simplified = simplifyDebts(netBalances);

        res.json({ netBalances, simplified });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to calculate balances' });
    }
};

export const deleteExpense = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.expense.delete({ where: { id: String(id) } });
        res.json({ message: 'Expense deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete expense' });
    }
};
