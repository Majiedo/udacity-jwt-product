import bcrypt from "bcrypt";
import { Router } from "express";

import { TOKEN_EXPIRATION } from "../configs";
import UserModel from "../models/user.model";
import { token } from "../helpers";

const userModal = new UserModel();

const api = Router();

api.get("/", async (req, res) => {
  res.send("Hello there!");
});

api.post("/login/", async (req, res) => {
  const { id, password } = req.body;
  if (!id || !password) return res.status(400).send();
  const user = await userModal.getById(id);
  if (!user) return res.status(404).send(`No user found with id: ${id}`);
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).send("Password mismatch");
  const accessToken = await token.generate(
    { sub: id, admin: user.superuser },
    TOKEN_EXPIRATION
  );
  res.send({
    accessToken,
  });
});

export { api };
