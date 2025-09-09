import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Create the connection
const client = postgres(process.env.DB_URL!, { prepare: false });

// Create the drizzle instance
const db = drizzle(client, { schema });

export default db;