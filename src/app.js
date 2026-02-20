const express = require('express');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

app.use(express.json());

app.use('/api/transacoes', transactionRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Erro interno do servidor' });
});

module.exports = app;
