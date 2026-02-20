const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const {
  create,
  list,
  getById,
  update,
  remove,
  balance,
} = require('../controllers/transactionController');

const router = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

router.use(limiter);

router.post('/', create);
router.get('/', list);
router.get('/saldo', balance);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
