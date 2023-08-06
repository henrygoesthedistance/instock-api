//call knex, uuid, express module
const knex = require('knex')(require('../knexfile'))
const { v4: uuid } = require('uuid');
const express = require('express')

//call router module
const router = express.Router();
router.use(express.json())

//get list of all inventory item
exports.index = (_req, res) => {
    knex('inventories')
        .then((data) => {
            res.json(data);
        })
        .catch((err) => res.status(500).send("Error getting inventory"))
}

//add a new item to the inventory list
exports.add = (req, res) => {
    info = {
        ...req.body, id: uuid()
    }
    if (
        req.body.warehouse_id &&
        req.body.item_name &&
        req.body.description &&
        req.body.category &&
        req.body.status &&
        req.body.quantity
    ) {
        knex('inventories')
            .insert(reqData)
            .then((data) => res.status(201).json(info))
            .catch((err) => res.status(500).send(`Inventory create fail`))
    } else {
        return res.status(400).send(`Required field missing`)
    }}

//edit an item from the inventory list
exports.update = (req, res) => {
    info = {
        ...req.body, updated_at: knex.fn.now()
    }
    const inventoryItem = req.params.itemid;

    knex('inventories')
        .where({ id: inventoryItem })
        .update(info)
        .then(() => res.status(200).send(`Inventory updated`))
        .catch((err) => res.status(500).send(`Inventory update fail`))
}

//delete an item from the inventory list
exports.delete = (req, res) => {
    const inventoryItem = req.params.itemid;

    knex('inventories')
        .where({ id: inventoryItem })
        .delete()
        .then(() => res.json("Successfully deleted inventory item"))
        .catch((err) => res.status(500).send("Error deleting inventory item"))
}

//get an item from the inventory list, with id
exports.get = (req, res) => {
    const inventoryItem = req.params.itemid;
    
    knex('inventories')
        .where({ id: inventoryItem })
        .then((data) => {
            if (data) {
                res.json(data);
            } else {
                res.status(404).send("Inventory item not found");
            }
        })
        .catch((err) => {
            res.status(500).send("Error getting inventory");
    })
}

//search an item from the inventory list with a keyword
exports.apiSearch = (req, res) => {
    const searchBox = req.query.s;

    knex("inventories")
        .where(function () {
            this
                .where('item_name', 'LIKE', `%${searchBox}%`)
                .orWhere('warehouse_id', 'LIKE', `%${searchBox}%`)
                .orWhere('category', 'LIKE', `%${searchBox}%`)
                .orWhere('description', 'LIKE', `%${searchBox}%`)
        })
        .select('*')
        .then((data) => {
            if (data) {
                res.json(data);
            } else {
                res.status(404).send("Inventory item not found");
            }
        })
        .catch((err) => {
            res.status(500).send("Error finding inventory item");
        })
}

//export the module
module.export = router;