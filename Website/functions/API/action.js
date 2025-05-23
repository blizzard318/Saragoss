import { createClient } from '@supabase/supabase-js';

export async function onRequestPut(context) { //Submit action
  const supabaseUrl = context.env.SUPABASE_URL;
  const supabaseKey = context.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return new Response(error.message, { status: 401 });
  }

  const { action } = await context.request.json();
  if (!action ) return new Response("Missing Action", { status: 400 });

  const chardata = await context.env.Characters.get(data.user.id);
  const ship = chardata.split(',')[2];

  const query = `
        INSERT INTO Actions (UUID, Ship, Action)
        VALUES (?, ?, ?)
        ON CONFLICT(UUID) DO UPDATE SET
          Ship = excluded.Ship,
          Action = excluded.Action
      `;
  const params = [data.user.id, ship, action];

  const result = await context.env.database.prepare(query).bind(...params).run();

  return new Response(JSON.stringify({ message: 'Action Successful' }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}