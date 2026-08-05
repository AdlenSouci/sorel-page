import mysql from "mysql2/promise";
import { ensureDatabaseUrl } from "../lib/database-url.js";
import { poolOptions } from "../lib/mysql-ssl.js";

ensureDatabaseUrl();

const pool = mysql.createPool(poolOptions());

export { pool };
