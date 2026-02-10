import { Expense, ExpenseShare, User } from '@prisma/client';

interface SimplifiedDebt {
    from: string;
    to: string;
    amount: number;
}

export const calculateBalances = (expenses: (Expense & { shares: ExpenseShare[] })[]) => {
    const balances: Record<string, number> = {};

    expenses.forEach(expense => {
        // Payer paid positive amount
        balances[expense.payerId] = (balances[expense.payerId] || 0) + expense.amount;

        // Shares are debt (negative)
        expense.shares.forEach(share => {
            balances[share.userId] = (balances[share.userId] || 0) - share.amount;
        });
    });

    return balances;
};

// Simplified debt graph (greedy algorithm)
export const simplifyDebts = (balances: Record<string, number>): SimplifiedDebt[] => {
    const debts: SimplifiedDebt[] = [];
    const credit = [];
    const debit = [];

    for (const [userId, amount] of Object.entries(balances)) {
        if (amount > 0.01) credit.push({ userId, amount });
        if (amount < -0.01) debit.push({ userId, amount });
    }

    credit.sort((a, b) => b.amount - a.amount);
    debit.sort((a, b) => a.amount - b.amount); // most negative first

    let i = 0;
    let j = 0;

    while (i < credit.length && j < debit.length) {
        const creditor = credit[i];
        const debtor = debit[j];

        const amount = Math.min(creditor.amount, -debtor.amount);

        debts.push({
            from: debtor.userId,
            to: creditor.userId,
            amount: Number(amount.toFixed(2))
        });

        creditor.amount -= amount;
        debtor.amount += amount;

        if (Math.abs(creditor.amount) < 0.01) i++;
        if (Math.abs(debtor.amount) < 0.01) j++;
    }

    return debts;
};
