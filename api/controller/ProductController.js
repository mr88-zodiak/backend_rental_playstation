require("dotenv").config();
const users = require("../models/Users");
const Product = require("../models/Product");

exports.getDataByUUID = async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const userData = await Product.getProduct(uuid);
    res.status(200).json({
      status: "success",
      data: userData,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const userData = await Product.getAllProducts();
    res.status(200).json({
      status: "success",
      data: userData,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    let { name, description, price, status, image } = req.body;
    if (!req.file) {
      return res.status(400).json({
        status: "failed",
        message: "gambar tidak ditemukan",
      });
    }
    console.log(data);
    const newProduct = await Product.createProduct({ name, description, price, status, image });
    res.status(201).json({
      status: "success",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const { name, description, price, status, image } = req.body;
    const updatedProduct = await Product.updateProduct(uuid, { name, description, price, status, image });
    res.status(200).json({
      status: "success",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const result = await Product.deleteProduct(uuid);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
