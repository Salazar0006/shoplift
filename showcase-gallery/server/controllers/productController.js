import Product from "../models/Product.js";
import { checkDBStatus } from "../config/db.js";

// In-memory fallback store so gallery works immediately even before MongoDB credentials are set
let inMemoryProducts = [
  {
    _id: "demo-1",
    name: "Aura Noise-Cancelling Headphones",
    price: 3499,
    description: "Premium wireless audio with active noise cancellation, transparency mode, and 40-hour battery life.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "demo-2",
    name: "Mechanical Ergonomic Keyboard",
    price: 2899,
    description: "Custom 75% wireless mechanical keyboard with hot-swappable switches and custom dye-sub PBT keycaps.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: "demo-3",
    name: "Ultra-Wide Curved Productivity Monitor",
    price: 18999,
    description: "34-inch 144Hz WQHD curved display with USB-C 90W power delivery and sRGB 99% color accuracy.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

// @desc    Get all products
// @route   GET /api/products
export const getProducts = async (req, res) => {
  try {
    if (checkDBStatus()) {
      let products = await Product.find().sort({ createdAt: -1 });
      if (products.length === 0) {
        // Automatically seed demo products into Atlas on first connect
        const seeded = await Product.insertMany(
          inMemoryProducts.map(({ _id, createdAt, ...rest }) => rest)
        );
        return res.status(200).json(seeded);
      }
      return res.status(200).json(products);
    }
    res.status(200).json(inMemoryProducts);
  } catch (error) {
    res.status(200).json(inMemoryProducts);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    if (checkDBStatus()) {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });
      return res.status(200).json(product);
    }
    const product = inMemoryProducts.find((p) => p._id === req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, image } = req.body;

    if (!name || price === undefined || !description || !image) {
      return res.status(400).json({
        message: "Please provide all required fields: name, price, description, image",
      });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: "Price must be a valid positive number" });
    }

    if (checkDBStatus()) {
      const product = await Product.create({
        name: name.trim(),
        price: numericPrice,
        description: description.trim(),
        image,
      });
      return res.status(201).json(product);
    }

    const newProduct = {
      _id: `prod-${Date.now()}`,
      name: name.trim(),
      price: numericPrice,
      description: description.trim(),
      image,
      createdAt: new Date().toISOString(),
    };
    inMemoryProducts.unshift(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, image } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (price !== undefined) {
      const numericPrice = Number(price);
      if (isNaN(numericPrice) || numericPrice < 0) {
        return res.status(400).json({ message: "Price must be a valid positive number" });
      }
      updateData.price = numericPrice;
    }
    if (description !== undefined) updateData.description = description.trim();
    if (image !== undefined) updateData.image = image;

    if (checkDBStatus()) {
      const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!product) return res.status(404).json({ message: "Product not found" });
      return res.status(200).json(product);
    }

    const index = inMemoryProducts.findIndex((p) => p._id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Product not found" });
    inMemoryProducts[index] = { ...inMemoryProducts[index], ...updateData };
    res.status(200).json(inMemoryProducts[index]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    if (checkDBStatus()) {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });
      return res.status(200).json({ message: "Product deleted successfully", id: req.params.id });
    }

    inMemoryProducts = inMemoryProducts.filter((p) => p._id !== req.params.id);
    res.status(200).json({ message: "Product deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
