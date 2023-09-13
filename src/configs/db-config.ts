import { createPool } from "slonik";
import { DB_HOST, DB_NAME, DB_PWD, DB_USER } from "./env-config";

const connectionString = `postgres://${DB_USER}:${DB_PWD}@${DB_HOST}:5432/${DB_NAME}`;

export const _dbContext = createPool(connectionString);
