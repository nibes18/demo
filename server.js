const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

let orders = [];

app.post('/place-order', (req, res) => {
    const order = req.body;
    orders.push(order);
    console.log('Order received:', order);
    res.status(201).json({ message: 'Order placed successfully!' });
});

app.get('/orders', (req, res) => {
    res.json(orders);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
