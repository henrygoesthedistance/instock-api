const knex = require('knex')(require('../knexfile'))
const { v4: uuid } = require('uuid');
const express = require('express')

const router = express.Router();
router.use(express.json())

exports.index = (_req, res) => {
    knex('warehouses')
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => res.status(400).send(`Inventory retrieve error: ${err}`))
}

exports.getDetail = (req, res) => {
    knex('warehouses')
        .where({ id: req.params.warehouseid })
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => {
            res.status(400).send(`Warehouse date retrieve fail: ${error}`)
        })
}

exports.delete = (req, res) => {
    knex('warehouses')
        .where("id", req.params.warehouseid)
        .delete()
        .then(() => {
            res.status(200).send(`Warehouse deleted, #${req.params.warehouseid}.`)
        })
        .catch((err) => {
            res.status(500).send(`Warehouse delete fail, #${req.params.warehouseid}: ${err}`)
        })
}

exports.update = (req, res) => {
    info = {
        ...req.body, updated_at: knex.fn.now()
    }
    knex('warehouses')
        .where({ id: req.params.warehouseid })
        .update(info)
        .then(() => {
            res.status(200).send(`Warehouse updated, #${req.params.warehouseid}`)
        })
        .catch((err) => {
            res.status(500).send(`Warehouse update fail, #${req.params.warehouseid}: ${err}`)
        })
}

exports.getInventory = (req, res) => {
    knex('inventories')
        .where({ warehouse_id: req.params.warehouseid })
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(400).send(`Warehouse data retrieve fail: ${err}`))
}

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
                res.status(500).send(`Warehouse create fail ${req.body.warehouse_name} ${err}`)
            })
    } else {
        return res.status(400).send(`Required field missing`)
    }
}

module.export = router;