import * as dotenv from "dotenv";
dotenv.config();

export const { SERVER_PORT, DB_HOST, DB_USER, DB_PWD, DB_NAME,JWT_SECRET_KEY } = process.env;