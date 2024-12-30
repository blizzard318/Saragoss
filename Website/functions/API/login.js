import { createClient } from '@supabase/supabase-js';

export async function onRequestGet(context) { //Login
  const supabaseUrl = context.env.SUPABASE_URL;
  const supabaseKey = context.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { email, password } = await context.request.json();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  const CreateCharacter = ctx.env.keyvalue.get(data.user.id) == null;

  return new Response(JSON.stringify({ message: 'Login Successful', CreateCharacter: CreateCharacter}), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}

export async function onRequestPost(context) { //Register
  const supabaseUrl = context.env.SUPABASE_URL;
  const supabaseKey = context.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { email, password } = await context.request.json();
  const { user, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  return new Response(JSON.stringify({ message: 'Registration Successful' }), {
    headers: { 'Content-Type': 'application/json' },
	status: 201,
  });
}
