const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8081;


app.use(cors({origin: process.env.BACKEND_URL || 'http://localhost'}));
app.use(express.json());
app.use(express.static('public'))
