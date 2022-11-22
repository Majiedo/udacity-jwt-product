import { Router } from "express";
import { auth } from "../helpers";

import UserModel from "../models/user.model";

const userModal = new UserModel();

const api = Router();

api.get(
  "/all/",
  auth.requiresAuth(async (req, res) => {
    const users = await userModal.getAll();
    res.send(users);
  })
);

api.get(
  "/:id/",
  auth.requiresAuth(async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).send();
    const user = await userModal.getById(id);
    if (!user) res.status(204);
    res.send(user || `No user found with id: ${id}`);
  })
);

api.post(
  "/",
  auth.requiresAuth(async (req, res, auth) => {
    if (!auth.admin) return res.status(401).send();
    const { id, firstname, lastname, password, superuser } = req.body;
    if (!id || !firstname || !lastname || !password)
      return res.status(400).send();
    const user = await userModal.create({
      id,
      firstName: firstname,
      lastName: lastname,
      password,
      superuser,
    });
    res.send(user);
  })
);

api.put(
  "/",
  auth.requiresAuth(async (req, res, auth) => {
    const { id, firstname, lastname, password, superuser } = req.body;
    if (!id) return res.status(400).send();
    if (id !== auth.sub && !auth.admin) return res.status(401).send();
    const user = await userModal.getById(id);
    if (!user) return res.status(204).send(`No user found with id: ${id}`);
    const newUserObject = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      superuser: user.superuser,
    };
    if (firstname) newUserObject.firstName = firstname;
    if (lastname) newUserObject.lastName = lastname;
    if (password) newUserObject.password = password;
    if (superuser) newUserObject.superuser = superuser;

    const userUpdate = await userModal.update(newUserObject);
    res.send(userUpdate);
  })
);

api.delete(
  "/:id/",
  auth.requiresAuth(async (req, res, auth) => {
    if (!auth.admin) return res.status(401).send();
    const { id } = req.params;
    if (!id) return res.status(400).send();
    const user = await userModal.getById(id);
    if (!user) return res.status(204).send(`No user found with id: ${id}`);
    await userModal.delete(id);
    res.send("deleted successfully!");
  })
);

export { api };
