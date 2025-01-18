import { createClient } from '@supabase/supabase-js';

export async function onRequestPost(context) { //Register or login
  const supabaseUrl = context.env.SUPABASE_URL;
  const supabaseKey = context.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { email, password, method } = await context.request.json();
  if (!email || !password || !method) return new Response("Missing Email or Password", { status: 400 });

  let body, init;
  switch (method){
    case 'login': {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return new Response(error.message, { status: 400 });

      let name = null;
      let ship = null;
      const character = await ctx.env.Characters.get(data.user.id);
      if (character){
        const [...details] = character.split(',');
        name = details[1];
        ship = details[2];
      }

      body = JSON.stringify({ message: 'Login Successful', uuid: data.user.id, name: name, ship: ship });
      init = {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      };
    }
    
    case 'register': {
      const { user, error } = await supabase.auth.signUp({ email, password });
      if (error) return new Response(error.message, { status: 400 });
      
      body = JSON.stringify({ message: 'Registration Successful' });
      init = {
        headers: { 'Content-Type': 'application/json' },
        status: 201,
      };
    }
  }
  return new Response(body, init);
}
