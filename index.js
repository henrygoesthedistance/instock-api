require('dotenv').config();

const knex = require("knex")(require("./knexfile"));
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors({origin: process.env.BACKEND_URL || 'http://localhost'}));
app.use(express.json());
app.use(express.static('public'))



app.listen(PORT, () => console.log("App is listening on port 8081"));