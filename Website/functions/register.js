/*import { createClient } from '@supabase/supabase-js';

export async function onRequest(context) {
  const { email, password } = await context.request.json();
  
  const supabaseUrl = context.env.SUPABASE_URL;
  const supabaseKey = context.env.SUPABASE_PRIVATE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { user, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  return new Response(JSON.stringify({ message: 'Signup successful', user }), {
    headers: { 'Content-Type': 'application/json' },
  });
}*/