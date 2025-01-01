import { createClient } from '@supabase/supabase-js';

export async function onRequestGet(context) { //Get Character
  const data = await context.request.json();
const uuid = data.uuid;
 if (!uuid){
const supabaseUrl = context.env.SUPABASE_URL;
  const supabaseKey = context.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    return new Response(error.message, { status: 401 });
  }
uuid = data.user.id;
}
  
  const character = await ctx.env.keyvalue.get(uuid);
  if (character != null) {
	  const [...data] = character.split(',');
	  const name = data[1];
	  const ship = data[2];
  }
  
  return new Response(JSON.stringify({ message: 'GET Successful', name: name, ship: ship}), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}

export async function onRequestPut(context) { //Create Character
  const supabaseUrl = context.env.SUPABASE_URL;
  const supabaseKey = context.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    return new Response(error.message, { status: 401 });
  }
  
  const { name, ship } = await context.request.json();
if (!name || !ship) return new Response("Missing name or ship", { status: 400 });
  
  const CurrentDate = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Singapore"}));
  const Year = CurrentDate.getFullYear();
  const Month = CurrentDate.getMonth() + 1;
  const Day = CurrentDate.getDate();
  const CreationDate = [Year, Month, Day].join('-');
  
  const ToUpload = [CreationDate, name, ship].join(',');
  await ctx.env.keyvalue.put(data.user.id, ToUpload);
  
  return new Response(JSON.stringify({ message: 'Create Successful' }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}
