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

// frontend (POST): /warehouses (add the req body of the new warehouse)
app.post('/warehouses', (req, res) => {
    // Validate the request body for required data
    if (!req.body.name || !req.body.address || !req.body.city || !req.body.country || !req.body.contactName || !req.body.position || !req.body.phoneNumber || !req.body.email) {
      return res.status(400).send('Please make sure to provide all the info');
    }
  
    knex('warehouses')
      .insert(req.body)
      .then((data) => {
        // For POST requests we need to respond with 201 and the location of the newly created record
        const newWarehouseURL = `/warehouses/${data[0]}`;
        res.status(201).location(newWarehouseURL).send(newWarehouseURL);
      })
      .catch((err) => res.status(400).send(`Error creating Warehouse: ${err}`));
});

// DELETE a warehouse
app.delete('/warehouses/:id', (req, res) => {
    knex('warehouses')
      .delete()
      .where({ id: req.params.id })
      .then(() => {
        // For DELETE response we can use 204 status code
        res.status(204).send(`Warehouse with id: ${req.params.id} has been deleted`);
      })
      .catch((err) => {
        res.status(400).send(`Error deleting Warehouse ${req.params.id} ${err}`)
        });
});

// Update a warehouse (PUT)
app.put('/warehouses/:id', (req, res) => {
    knex('warehouses')
        .update(req.body)
        .where({ id: req.params.id })
        .then(() => {
            // For DELETE response we can use 204 status code
            res.status(200).send(`Warehouse with id: ${req.params.id} has been updated`);
        })
        .catch((err) => {
            res.status(400).send(`Error updating Warehouse ${req.params.id} ${err}`)
        });
  });

app.listen(PORT, () => console.log("App is listening on port 8081"));
