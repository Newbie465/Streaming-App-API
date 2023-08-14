import { configDotenv } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import {Pool} from 'pg'
configDotenv()

const pool = new Pool({
    connectionString: process.env.DATABASE_CONNECTION,  
    ssl : true
})

export const db = drizzle(pool)
