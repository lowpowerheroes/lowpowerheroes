import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
// Importa tutto come 'schema' dal nuovo file index.ts
import * as schema from "./schema";

const client = postgres(env.DATABASE_URL);

// Passa l'oggetto 'schema' completo a drizzle
export const db = drizzle(client, { schema });
