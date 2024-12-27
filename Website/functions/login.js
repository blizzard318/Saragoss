/*import { createClient } from '@supabase/supabase-js';

export async function onRequestPost(context) {
  const supabaseUrl = context.env.SUPABASE_URL;
  const supabaseKey = context.env.SUPABASE_PRIVATE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { email, password } = await context.request.json();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  return new Response(JSON.stringify({ message: 'Login successful', user: data.user }), {
    headers: { 'Content-Type': 'application/json' },
  });
}*/