//call dotenv, express,cors module
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

//setup the port
const PORT = process.env.PORT || 5050;

//call the warehouse & inventory route 
const warehouseRoute = require('./routes/warehouseRoute');
const inventoryRoute = require('./routes/inventoryRoute');

app.use(cors());
app.use(express.json());

// warehouse & inventory homepage
app.use('/warehouse', warehouseRoute);
app.use('/inventory', inventoryRoute);

//listen the port 
app.listen(PORT, () => {
    console.log(`server running `)
});