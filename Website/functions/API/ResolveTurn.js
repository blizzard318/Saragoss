import jwt from '@tsndr/cloudflare-worker-jwt';
//Why not make a scheduled cloudflare worker instead of this github action cronjob?
//Because then I'll have 2 cron jobs.
export async function onRequestGet(context) {  
	const authorization = context.request.headers.get('Authorization');
	if (!authorization) 
		return new Response(JSON.stringify({ msg: 'Authorization header is missing' }), { status: 401 });
	
	
	const token = authorization.split(' ')[1];
	if (!token) 
		return new Response(JSON.stringify({ msg: 'Token is missing' }), { status: 401 });
	
	
	const verifiedToken = await jwt.verify(token, context.env.JWT_SECRET, { clockTolerance: 60 });
	if (!verifiedToken) 
		return new Response(JSON.stringify({ msg: 'Token is wrong' }), { status: 401 });
	

 	let resp = await context.env.ASSETS.fetch('current.json');
	const CurrentTurn = await resp.json(); 

	resp = await context.env.ASSETS.fetch('meta.json');
	const meta = await resp.json(); 

	const result = await context.env.database.prepare(`
						SELECT Ship, Action, COUNT(*) AS action_count
						FROM Actions
						GROUP BY Ship, Action
					`).all();
	

	//Gotta factor weather into these
	const FoodMultiplier = (Math.random() * (2 - 1.1)) + 1.1;
	const WoodMultiplier = (Math.random() * (2 - 1.1)) + 1.1;

	const Damage = {};
	const Raiding = {};
	const Repairs = {};
	//first pass
	result.results.forEach((row) => {
		switch (row.Action) {
		  case 'repair':
  			Damage[row.Ship] -= row.action_count;
			CurrentTurn.Ships[row.Ship].Food -= row.action_count;
			Repairs[row.Ship] += row.action_count;
			break;
		  case 'fish': //Fishers feed selves, can overfish but cannot get more fish than limit
  			Damage[row.Ship] -= row.action_count;
			CurrentTurn.Ships[row.Ship].Food += row.action_count * FoodMultiplier;
			break;
		  case 'salvage': //can over-salvage but cannot get more wood than limit
			CurrentTurn.Ships[row.Ship].Food -= row.action_count;
			CurrentTurn.Ships[row.Ship].Wood += row.action_count * WoodMultiplier;
			break;
		default:
			if (row.Action.includes('raid')) {
				const ToAtk = row.Action.split(':')[1];
				Damage[ToAtk] += row.action_count;
				Raiding[row.Ship] += row.action_count;
				CurrentTurn.Ships[row.Ship].Food -= row.action_count;
				row.action_count = 0;
			}
			else row.action_count = 0;
			break;
		}
	  });
	  result.results = result.results.filter(row => row.action_count != 0);

	//Gotta factor weather into these
	const FoodRot = (Math.random() * (5 - 1)) + 1;
	const WoodRot = (Math.random() * (5 - 1)) + 1;
	const HealthRot = (Math.random() * (5 - 1)) + 1;
	Object.entries(CurrentTurn.Ships).forEach(([shipName, ship]) =>
	{
		ship.Food -= FoodRot;
		ship.Wood -= WoodRot;
		ship.Health -= HealthRot;

		const MissingHealth = meta.MaxHealth - ship.Health;
		const ActualRepairs = Math.min(Repairs[shipName], MissingHealth, ship.Wood);
		
		ship.Wood -= ActualRepairs;
		ship.Health += ActualRepairs;

		if (ship.Food >= meta.MaxFood) ship.Food = meta.MaxFood;
		if (ship.Wood >= meta.MaxWood) ship.Wood = meta.MaxWood;
		if (ship.Health >= meta.MaxHealth) ship.Health = meta.MaxHealth;
	});

	const { results } = await context.env.database.prepare('SELECT UUID, Action FROM Actions;').all();
	const bulkData = results.map(row => ({
		key: row.UUID,
		value: row.Action,
		expiration_ttl: 86400 // Optional: Auto-expire after 24 hours
	}));

	await fetch(`https://api.cloudflare.com/client/v4/accounts/${context.env.CLOUDFLARE_ID}/storage/kv/namespaces/${context.env.CLOUDFLARE_KV_PREVIOUS_ACTIONS}/bulk`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			'X-Auth-Email': context.env.CLOUDFLARE_EMAIL,
			'X-Auth-Key'  : context.env.CLOUDFLARE_TOKEN
		},
		body: JSON.stringify(bulkData)
	});
	//TO-DO: implement pagination
	
	await context.env.database.prepare('DELETE FROM Actions;').run();
	
	//Get current date in Singapore
	/*const singaporeDate = new Date().toLocaleString('en-GB', {
		timeZone: 'Asia/Singapore',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});*/

	const weatherOptions = ["Cold", "Foggy", "Hot", "Stormy", "Windy", "Calm"];
	CurrentTurn.Weather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];

	return new Response(JSON.stringify({ msg: "Completed" }),{
		headers: { 'Content-Type': 'application/json' },
		status: 200,
	});
}
