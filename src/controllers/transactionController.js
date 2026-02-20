const Transaction = require('../models/Transaction');

const create = async (req, res, next) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Movimentação não encontrada' });
    res.json(transaction);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!transaction) return res.status(404).json({ message: 'Movimentação não encontrada' });
    res.json(transaction);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Movimentação não encontrada' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const balance = async (req, res, next) => {
  try {
    const result = await Transaction.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: '$value' },
        },
      },
    ]);

    const receitas = result.find((r) => r._id === 'receita')?.total ?? 0;
    const despesas = result.find((r) => r._id === 'despesa')?.total ?? 0;
    res.json({ receitas, despesas, saldo: receitas - despesas });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, list, getById, update, remove, balance };
