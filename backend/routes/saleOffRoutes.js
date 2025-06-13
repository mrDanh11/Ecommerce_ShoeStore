const express = require('express');
const router = express.Router();

const { getSaleOffs, getSaleOffCount, insertSaleOff, deleteSaleOff, updateSaleOff } = require('../controllers/saleOffController');

router.post('/', insertSaleOff);
router.get('/', getSaleOffs);
router.get('/count', getSaleOffCount);
router.delete('/:id', deleteSaleOff);
router.put('/:id', updateSaleOff);

module.exports = router;