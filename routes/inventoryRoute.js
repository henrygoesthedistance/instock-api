//call express, router module
const express = require('express')
const router = express.Router();
router.use(express.json())

//call the inventory controller module
const inventoryController = require('../controllers/inventoryController')

//get all item
//add a new item
router.route('/').get(inventoryController.index)
    .post(inventoryController.add);

//get an item with id
//delete an item with id
//update an item with id
router.route('/:itemid').get(inventoryController.get)
    .delete(inventoryController.delete)
    .put(inventoryController.update);

//search items with a key word
router.route('/api/inventories').get(inventoryController.apiSearch)

//export the module as a router
module.exports = router;