import { createClient } from '@supabase/supabase-js';

export async function onRequestGet(context) { //Login
  const supabaseUrl = context.env.SUPABASE_URL;
  const supabaseKey = context.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { email, password } = await context.request.json();
if (!email || !password) return new Response("Missing Email or Password", { status: 400 });
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return new Response(error.message, { status: 400 });
  }

let name = null;
let ship = null;
  const character = await ctx.env.keyvalue.get(data.user.id);
if (character){
const [...details] = character.split(',');
name = details[1];
ship = details[2];
}

  return new Response(JSON.stringify({ message: 'Login Successful', uuid: data.user.id, name: name, ship: ship}), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}

export async function onRequestPost(context) { //Register
  const supabaseUrl = context.env.SUPABASE_URL;
  const supabaseKey = context.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { email, password } = await context.request.json();
if (!email || !password) return new Response("Missing Email or Password", { status: 400 });
  const { user, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  return new Response(JSON.stringify({ message: 'Registration Successful' }), {
    headers: { 'Content-Type': 'application/json' },
	status: 201,
  });
}
