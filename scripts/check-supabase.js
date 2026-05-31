/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");

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
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  // Check quotes fields
  const quotesRes = await fetch(`${url}/rest/v1/quotes?select=id,next_follow_up_at,follow_up_stage,last_follow_up_channel&limit=1`, {
    headers: { apikey: key, authorization: `Bearer ${key}` },
  });
  
  if (!quotesRes.ok) {
    console.error(`quotes check failed: HTTP ${quotesRes.status}`);
    console.error(await quotesRes.text());
    process.exitCode = 1;
    return;
  }

  // Check quote_follow_ups
  const followUpRes = await fetch(`${url}/rest/v1/quote_follow_ups?select=id&limit=1`, {
    headers: { apikey: key, authorization: `Bearer ${key}` },
  });

  if (!followUpRes.ok) {
    console.error(`quote_follow_ups check failed: HTTP ${followUpRes.status}`);
    console.error(await followUpRes.text());
    process.exitCode = 1;
    return;
  }

  // Check profiles.stripe_current_period_end
  const profileRes = await fetch(`${url}/rest/v1/profiles?select=id,stripe_current_period_end&limit=1`, {
    headers: { apikey: key, authorization: `Bearer ${key}` },
  });

  if (!profileRes.ok) {
    console.error(`profiles check failed: HTTP ${profileRes.status}`);
    console.error(await profileRes.text());
    process.exitCode = 1;
    return;
  }

  console.log("Supabase REST check passed. All new schema fields exist.");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
