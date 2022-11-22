import { client } from "./../database/client";
import { User } from "../types";
import { log } from "../server";
import bcrypt from "bcrypt";

import { SALT_ROUNDS } from "../configs";

//declare UserModel
class UserModel {
  //get all users
  async getAll(): Promise<User[]> {
    const sql = "SELECT * FROM users";
    try {
      //run query
      const result = await client.query(sql);

      //return all users
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to fetch all user (${(error as Error).message})`);
    }
  }

  //get specific user
  async getById(id: string): Promise<null | User> {
    const sql = "SELECT * FROM users WHERE id = $1";
    try {
      //run query
      const result = await client.query(sql, [id]);

      //return null if the fetching didn't find user that match id
      if (!result.rows.length) return null;

      //return found user
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to fetch user with id: (${id}: ${(error as Error).message})`
      );
    }
  }

  //create user
  async create(user: User): Promise<User> {
    const passwordEncrypt = await bcrypt.hash(user.password, SALT_ROUNDS);
    const sql =
      "INSERT INTO users(id, firstname, lastname, password, superuser) VALUES($1, $2, $3, $4, $5) returning *";
    try {
      //run query
      const result = await client.query(sql, [
        user.id,
        user.firstName,
        user.lastName,
        passwordEncrypt,
        user.superuser,
      ]);
      //log that user has created
      log.info(`user ${user.firstName} has created successfully`);

      //return created user
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to create (${user.firstName}: ${(error as Error).message})`
      );
    }
  }

  //update user
  async update(user: User): Promise<User> {
    const passwordEncrypt = await bcrypt.hash(user.password, SALT_ROUNDS);
    const sql =
      "UPDATE users SET firstname = $1, lastname = $2, password = $3, superuser = $4 WHERE id = $5 returning *";
    try {
      //run query
      const result = await client.query(sql, [
        user.firstName,
        user.lastName,
        passwordEncrypt,
        user.superuser,
        user.id,
      ]);

      //log that user has updated
      log.info(`user ${user.firstName} has updated successfully`);

      //return updated user
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to update user with id: (${user.id}: ${
          (error as Error).message
        })`
      );
    }
  }

  //delete user
  async delete(id: string): Promise<void> {
    const sql = "DELETE FROM users WHERE id = $1";
    try {
      //run query
      await client.query(sql, [id]);

      //log that user has deleted
      log.info(`user with ${id} has deleted successfully`);
    } catch (error) {
      throw new Error(
        `Unable to delete user with id: (${id}: ${(error as Error).message})`
      );
    }
  }
}

export default UserModel;
