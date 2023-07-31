const knex = require('knex')(require('../knexfile'))
const { v4: uuid } = require('uuid');
const express = require('express')

const router = express.Router();
router.use(express.json())

exports.index = (_req, res) => {
    knex('inventories')
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => res.status(400).send(`Inventory retrieve fail: ${err}`))
}

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
            .catch((err) => res.status(500).send(`Inventory create fail ${err}`))
    } else {
        return res.status(400).send(`Required field missing`)
    }}

exports.update = (req, res) => {
    info = {
        ...req.body, updated_at: knex.fn.now()
    }
    knex('inventories')
        .where({ id: req.params.itemid })
        .update(info)
        .then(() => res.status(200).send(`Inventory updated, #${req.params.itemid}`))
        .catch((err) => res.status(500).send(`Inventory update fail, #${req.params.itemid}: ${err}`))
}

exports.delete = (req, res) => {
    knex('inventories')
        .where("id", req.params.itemid)
        .delete()
        .then(() => res.status(200).send(`Inventory deleted, #${req.params.itemid}.`))
        .catch((err) => res.status(500).send(`Inventory delete fail, #${req.params.itemid}: ${err}`))
}

exports.getDetail = (req, res) => {
    knex('inventories')
        .where({ id: req.params.itemid })
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(400).send(`Inventory data retrieve fail: ${error}`))
}
module.export = router;