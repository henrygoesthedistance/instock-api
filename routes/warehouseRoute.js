//call express, router module

const express = require('express')
const router = express.Router();
router.use(express.json())

//call warehouse controller module
const warehouseController = require('../controllers/warehouseController')

//get all items
//add a new item 
router.route('/').get(warehouseController.index)
    .post(warehouseController.add)

//get an item with id
//delete an item with id
//update an item with id
router.route('/:warehouseid').get(warehouseController.get)
    .delete(warehouseController.delete)
    .put(warehouseController.update)

//get the inventory item with a warehouse id 
router.route('/:warehouseid/inventory').get(warehouseController.getInventory)

//search items with a key word
router.route('/api/warehouses').get(warehouseController.apiSearch)

//export the module as a router
module.exports = router;