require('dotenv').config();

const knex = require("knex")(require("./knexfile"));
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors({origin: process.env.BACKEND_URL || 'http://localhost'}));
app.use(express.json());
app.use(express.static('public'))

// GET List of all Inventory Items
app.get("/inventory", (req, res) => {
    knex
        .select("*")
        .from("inventories")
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.status(500).send("Error getting inventory");
        })
});

// GET a Single Inventory Item
app.get("/inventory/:id", (req, res) => {
    const inventoryItem = req.params.id;

    knex
        .select("*")
        .from("inventories")
        .where({ id: inventoryItem })
        .first()
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
});

// GET request to filter the search term for the Warehouses List
app.get("/api/warehouses", (req, res) => {
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
});

// GET request to filter the search term for the Inventory List
app.get("/api/inventories", (req, res) => {
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
});

app.listen(PORT, () => console.log("App is listening on port 8081"));
