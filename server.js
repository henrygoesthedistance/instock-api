require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5050;
const warehousesRoute = require('./routes/warehouseRoute');
const inventoryRoute = require('./routes/inventoryRoute');

app.use(cors());
app.use(express.json());


app.get('/', (_req, res) => {
    res.send('Warehouse & inventory database')
});

app.use('/warehouse', warehousesRoute);
app.use('/inventory', inventoryRoute);

app.listen(PORT, () => {
    console.log(`server running `)
});