import { type Config, defineConfig } from 'drizzle-kit';

export default defineConfig({
 schema: './src/db/schema.ts',
 out: './migrations',
 dialect: 'sqlite',
 driver: 'turso',
 dbCredentials: {
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
 },
 migrations: {
  schema: './src/db/schema.ts',
 },
 verbose: true,
 // satisfies Config
}) as Config;
