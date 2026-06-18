import mysql from "mysql2/promise";
import { poolOptions } from "../lib/mysql-ssl.js";

const pool = mysql.createPool(poolOptions());

export { pool };
