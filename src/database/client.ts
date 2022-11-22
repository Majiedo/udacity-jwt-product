import { Client } from "pg";

export const client: Client = new Client({
  connectionString: process.env.POSTGRES_URL,
});
