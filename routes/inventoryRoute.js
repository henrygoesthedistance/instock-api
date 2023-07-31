const express = require('express')
const router = express.Router();
const inventoryController = require('../controllers/inventoryController')
router.use(express.json())

router.route('/').get(inventoryController.index)
    .post(inventoryController.add);

router.route('/:itemid').get(inventoryController.getDetail)
    .delete(inventoryController.delete)
    .put(inventoryController.update);

    module.exports = router;