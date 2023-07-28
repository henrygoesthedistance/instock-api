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

app.listen(PORT, () => console.log("App is listening on port 8081"));