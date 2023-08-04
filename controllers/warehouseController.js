//call knex, uuid, express module
const knex = require('knex')(require('../knexfile'))
const { v4: uuid } = require('uuid');
const express = require('express')

//call router module
const router = express.Router();
router.use(express.json())

//get all item from the warehouse database
exports.index = (_req, res) => {
    knex('warehouses')
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => res.status(400).send(`Inventory retrieve error`))
}

//get an item with it
exports.get = (req, res) => {
    const warehouseItem = req.params.warehouseid;
    
    knex('warehouses')
        .where({ id: warehouseItem })
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => {
            res.status(400).send(`Warehouse date retrieve fail`)
        })
}

// delete an item with id
exports.delete = (req, res) => {
    const warehouseItem = req.params.warehouseid;
    
    knex('warehouses')
        .where({ id: warehouseItem })
        .delete()
        .then(() => {
            res.status(200).send(`Warehouse deleted.`)
        })
        .catch((err) => {
            res.status(500).send(`Warehouse delete fail`)
        })
}

//update an item with id
exports.update = (req, res) => {
    const info = {
        ...req.body, updated_at: knex.fn.now()
    }
    const warehouseItem = req.params.warehouseid;

    knex('warehouses')
        .where({ id: warehouseItem })
        .update(info)
        .then(() => {
            res.status(200).send(`Warehouse updated`)
        })
        .catch((err) => {
            res.status(500).send(`Warehouse update fail`)
        })
}

//get the inventory item with a warehouse id
exports.getInventory = (req, res) => {
    const warehouseItem = req.params.warehouseid;
    
    knex('inventories')
        .where({ warehouse_id: warehouseItem })
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(400).send(`Warehouse data retrieve fail`))
}

// add an item to the warehouse list
exports.add = (req, res) => {
    info = {
        ...req.body, id: uuid()
    }
    if (
        req.body.warehouse_name &&
        req.body.address &&
        req.body.city &&
        req.body.country &&
        req.body.contact_name &&
        req.body.contact_position &&
        req.body.contact_phone &&
        req.body.contact_email
    ) {
        knex('warehouses')
            .insert(info)
            .then((data) => {
                res.status(201).json(info)
            })
            .catch((err) => {
                res.status(500).send(`Warehouse create fail`)
            })
    } else {
        return res.status(400).send(`Required field missing`)
    }
}

//search a warehosue use a key word
exports.apiSearch = (req, res) => {
    const searchBox = req.query.s;

    knex("warehouses")
        .where(function () {
            this
                .where('warehouse_name', 'LIKE', `%${searchBox}%`)
                .orWhere('address', 'LIKE', `%${searchBox}%`)
                .orWhere('city', 'LIKE', `%${searchBox}%`)
                .orWhere('country', 'LIKE', `%${searchBox}%`)
                .orWhere('contact_name', 'LIKE', `%${searchBox}%`)
                .orWhere('contact_position', 'LIKE', `%${searchBox}%`)
                .orWhere('contact_phone', 'LIKE', `%${searchBox}%`)
                .orWhere('contact_email', 'LIKE', `%${searchBox}%`)
        })
        .select('*')
        .then((data) => {
            if (data) {
                res.json(data);
            } else {
                res.status(404).send("Warehouse item not found");
            }
        })
        .catch((err) => {
            res.status(500).send("Error finding warehouse item");
        })
}

//export module as a router
module.export = router;