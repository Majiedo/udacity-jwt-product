import dotenv from "dotenv";
//load environment file!
dotenv.config();

//import logger and load
import Logger from "@ptkdev/logger";
export const log = new Logger();

import app from "./routes";
import { connect } from "./database";

connect();

const address: string = "0.0.0.0:3000";

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});
