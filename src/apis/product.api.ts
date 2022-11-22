import { Router } from "express";
import { auth } from "../helpers";

import ProductModel from "../models/product.model";

const productModel = new ProductModel();

const api = Router();

api.get("/all/", async (req, res) => {
  const products = await productModel.getAll();
  res.send(products);
});

api.get("/:id/", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).send();
  const product = await productModel.getById(id);
  if (!product) res.status(204);
  res.send(product);
});

api.post(
  "/",
  auth.requiresAuth(async (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) return res.status(400).send();
    const product = productModel.create({ name, price });
    res.send(product);
  })
);

api.put(
  "/",
  auth.requiresAuth(async (req, res) => {
    const { id, name, price } = req.body;
    if (!id) return res.status(400).send();
    const product = await productModel.getById(id);
    if (!product)
      return res.status(204).send(`No product found with id: ${id}`);
    const newProductObject = {
      id: product.id!,
      name: product.name,
      price: product.price,
    };
    if (name) newProductObject.name = name;
    if (price) newProductObject.price = price;
    const updatedProduct = await productModel.update(newProductObject);
    res.send(updatedProduct);
  })
);

api.delete(
  "/:id/",
  auth.requiresAuth(async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).send();
    const product = await productModel.getById(id);
    if (!product)
      return res.status(204).send(`No product found with id: ${id}`);
    await productModel.delete(id);
    res.send("deleted successfully!");
  })
);

export { api };
