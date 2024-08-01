const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Database connection
mongoose.connect('mongodb://localhost/localstore', { useNewUrlParser: true, useUnifiedTopology: true });

// Define schemas
const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String
});

const CartSchema = new mongoose.Schema({
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    totalPrice: Number
});

const Product = mongoose.model('Product', ProductSchema);
const Cart = mongoose.model('Cart', CartSchema);

app.use(bodyParser.json());
app.use(express.static('public'));

// Get products
app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Add to cart
app.post('/api/cart', async (req, res) => {
    const { productId } = req.body;
    const product = await Product.findById(productId);

    let cart = await Cart.findOne();
    if (!cart) {
        cart = new Cart({ products: [], totalPrice: 0 });
    }

    cart.products.push(product);
    cart.totalPrice += product.price;
    await cart.save();

    res.json(cart);
});

app.listen(PORT, () => {
    console.log(Server is running on http://localhost:${PORT});
});
