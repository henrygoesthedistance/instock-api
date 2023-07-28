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

app.listen(PORT, () => console.log("App is listening on port 8081"));