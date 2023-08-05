require('dotenv').config();

const knex = require("knex")(require("./knexfile"));
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

// app.use(cors({origin: process.env.BACKEND_URL } || 'http://localhost:8080'));
// this doesn't work unknown reason

app.use(cors());
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

// DELETE an Inventory Item
app.delete("/inventory/:id", (req, res) => {
    const inventoryItem = req.params.id;

    knex("inventories")
        .where({ id: inventoryItem })
        .del()
        .then(() => {
            res.json("Successfully deleted inventory item")
        })
        .catch((err) => {
            res.status(500).send("Error deleting inventory item");
        })
});

// GET request to provide the front-end with a list of all inventories for a given warehouse ID

app.get("/api/warehouses/:id/inventories", (req, res) => {
    const warehouseId = req.params.id;

    knex.select('warehouses.id', 'inventories.item_name', 'inventories.category', 'inventories.status', 'inventories.quantity')
        .from('warehouses')
        .join('inventories', 'warehouses.id', '=', 'inventories.warehouse_id')
        .where('warehouses.id', warehouseId)
        .then((data) => {
            if (data.length > 0) {
                res.status(200).json(data);
            } else {
                res.status(404).send("Warehouse ID not found");
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error");
        });
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

app.listen(PORT, () => console.log("App is listening on port 8080"));
