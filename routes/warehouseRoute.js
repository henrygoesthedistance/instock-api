const express = require('express')
const router = express.Router();
const warehouseController = require('../controllers/warehouseController')
router.use(express.json())

router.route('/').get(warehouseController.index)
    .post(warehouseController.add)

router.route('/:warehouseid').get(warehouseController.getDetail)
    .delete(warehouseController.delete)
    .put(warehouseController.update)

router.route('/:warehouseid/inventory').get(warehouseController.getInventory)

module.exports = router;