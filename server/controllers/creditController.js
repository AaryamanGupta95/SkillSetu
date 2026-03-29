const { Wallet, Transaction } = require('../models');

const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ where: { userId: req.userId } });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    const transactions = await Transaction.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });

    res.json({ wallet, transactions });
  } catch (error) {
    console.error('GetWallet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const spendCredits = async (req, res) => {
  try {
    const { itemId, amount, description } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const wallet = await Wallet.findOne({ where: { userId: req.userId } });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    wallet.balance -= amount;
    await wallet.save();

    const tx = await Transaction.create({
      userId: req.userId,
      type: 'spent',
      amount,
      description: `Purchased: ${description || itemId}`,
      balanceAfter: wallet.balance,
    });

    res.json({ message: 'Purchase successful!', wallet, transaction: tx });
  } catch (error) {
    console.error('SpendCredits error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getWallet, spendCredits };
