const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'html')));
app.use(express.static(path.join(__dirname, 'images')));

let orders = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

app.get('/cart.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'cart.html'));
});

app.get('/orders', (req, res) => {
    res.json(orders);
});

app.post('/place-order', (req, res) => {
    const order = req.body;
    order.status = 'pending';
    order.timestamp = new Date().toISOString();
    orders.push(order);
    res.json({ message: 'Order received', order });
});

app.post('/accept-order/:index', (req, res) => {
    const index = req.params.index;
    if (orders[index]) {
        orders[index].status = 'accepted';
        res.json({ message: 'Order accepted', order: orders[index] });
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
