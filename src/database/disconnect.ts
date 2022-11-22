import { client } from "./client";

//disconnect to the database
export async function disconnect(): Promise<void> {
  try {
    await client.end();
  } catch (error) {
    console.log("something went wrong while disconnect from database!", error);
  }
}
