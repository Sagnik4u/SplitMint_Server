import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createGroup = async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const userId = (req as any).user.id;

    try {
        const group = await prisma.group.create({
            data: {
                name,
                description,
                createdById: userId,
                members: {
                    create: { userId }
                }
            },
            include: { members: { include: { user: true } } }
        });
        res.json(group);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create group' });
    }
};

export const getMyGroups = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        const memberships = await prisma.groupMember.findMany({
            where: { userId },
            include: { group: { include: { members: { include: { user: true } } } } }
        });
        const groups = memberships.map(m => m.group);
        res.json(groups);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch groups' });
    }
};

export const getGroupDetails = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const group = await prisma.group.findUnique({
            where: { id: String(id) },
            include: {
                members: { include: { user: true } },
                expenses: {
                    include: { payer: true, shares: { include: { user: true } } },
                    orderBy: { date: 'desc' }
                }
            }
        });
        if (!group) return res.status(404).json({ error: 'Group not found' });
        res.json(group);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch group details' });
    }
};

export const addMember = async (req: Request, res: Response) => {
    const { groupId, email } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const member = await prisma.groupMember.create({
            data: {
                groupId,
                userId: user.id
            },
            include: { user: true }
        });
        res.json(member);
    } catch (error) {
        res.status(400).json({ error: 'User is likely already in the group' });
    }
};
