import { client } from "./../database/client";
import { log } from "../server";
import { Product } from "../types/product.type";

//declare ProductModel
class ProductModel {
  //get all products
  async getAll(): Promise<Product[]> {
    const sql = "SELECT * FROM products";
    try {
      //run query
      const result = await client.query(sql);

      //return all products
      return result.rows;
    } catch (error) {
      throw new Error(
        `Unable to fetch all products (${(error as Error).message})`
      );
    }
  }

  //get specific product
  async getById(id: number): Promise<null | Product> {
    const sql = "SELECT * FROM products WHERE id = $1";
    try {
      //run query
      const result = await client.query(sql, [id]);

      //return null if the fetching didn't find product that match id
      if (!result.rows.length) return null;

      //return found product
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to fetch product with id: (${id}: ${(error as Error).message})`
      );
    }
  }

  //create product
  async create(product: Product): Promise<string> {
    const sql = "INSERT INTO products(name, price) VALUES($1, $2) RETURNING id";
    try {
      //run query
      const result = await client.query(sql, [product.name, product.price]);

      //log that product has created
      log.info(`product ${product.name} has created successfully`);

      //return created product id
      return result.rows[0].id;
    } catch (error) {
      throw new Error(
        `Unable to create (${product.name}: ${(error as Error).message})`
      );
    }
  }

  //update product
  async update(product: Product) {
    const sql =
      "UPDATE products SET name = $1, price = $2 WHERE id = $3 returning *";
    try {
      //run query
      const result = await client.query(sql, [
        product.name,
        product.price,
        product.id,
      ]);

      //log that product has created
      log.info(`product ${product.name} has updated successfully`);

      //return updated product
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to update product with id: (${product.id}: ${
          (error as Error).message
        })`
      );
    }
  }

  //delete product
  async delete(id: number): Promise<void> {
    const sql = "DELETE FROM products WHERE id = $1";
    try {
      //run query
      await client.query(sql, [id]);

      //log that product has deleted
      log.info(`product with ${id} has deleted successfully`);
    } catch (error) {
      throw new Error(
        `Unable to delete product with id: (${id}: ${(error as Error).message})`
      );
    }
  }
}

export default ProductModel;
