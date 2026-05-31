/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const { Client } = require("pg");

function readEnv() {
  const env = {};

  for (const file of [".env", ".env.local"]) {
    if (!fs.existsSync(file)) {
      continue;
    }

    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      if (!line || line.trim().startsWith("#") || !line.includes("=")) {
        continue;
      }

      const index = line.indexOf("=");
      const key = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
      env[key] = value;
    }
  }

  return env;
}

async function main() {
  const env = { ...readEnv(), ...process.env };
  const databaseUrl = env.SUPABASE_DATABASE_URL || env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "Missing SUPABASE_DATABASE_URL. Use the Supabase pooler connection string from Project Settings > Database > Connect."
    );
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  await client.query(fs.readFileSync("supabase/schema.sql", "utf8"));
  const result = await client.query(
    "select to_regclass('public.quotes') as quotes, to_regclass('public.app_events') as app_events"
  );
  await client.end();

  console.log(result.rows[0]);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
