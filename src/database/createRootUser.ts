import UserModel from "../models/user.model";
import { log } from "../server";

const userModal = new UserModel();

export async function createRootUser() {
  const password = process.env.ROOT_USER_PASSWORD || "password";
  try {
    const rootUser = await userModal.getById("root");
    if (rootUser) return;
    userModal.create({
      id: "root",
      firstName: "Root",
      lastName: "Root",
      password,
      superuser: true,
    });
    log.sponsor("root user has been created!");
  } catch (error) {
    console.log("something went wrong while trying to create root user", error);
  }
}
