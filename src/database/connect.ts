import { log } from "../server";
import { client } from "./client";
import { createRootUser } from "./createRootUser";

//connect to the database
export async function connect(): Promise<void> {
  try {
    await client.connect();
    await createRootUser();
  } catch (error) {
    log.error(
      `something went wrong while trying to connect to database ${error}`
    );
  }
}
