import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let dbInstance: NeonHttpDatabase<typeof schema> | null = null;
let sqlClient: NeonQueryFunction<boolean, boolean> | null = null;

export function getDb(): {
  db: NeonHttpDatabase<typeof schema>;
  sql: NeonQueryFunction<boolean, boolean>;
} {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not defined");
  }

  if (!dbInstance || !sqlClient) {
    sqlClient = neon(connectionString);
    dbInstance = drizzle({ client: sqlClient, schema });
  }

  return { db: dbInstance, sql: sqlClient };
}

export { schema };
