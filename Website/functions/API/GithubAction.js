import jwt from '@tsndr/cloudflare-worker-jwt';
//Why not make a scheduled cloudflare worker instead of this github action cronjob?
//Because then I'll have 2 cron jobs.
export async function onRequestGet(context) {  
	const authorization = context.request.headers.get('Authorization');
	if (!authorization) {
		return new Response(JSON.stringify({ msg: 'Authorization header is missing' }), { status: 401 });
	}
	
	const token = authorization.split(' ')[1];
	if (!token) {
		return new Response(JSON.stringify({ msg: 'Token is missing' }), { status: 401 });
	}
	
	const verifiedToken = await jwt.verify(token, context.env.JWT_SECRET, { clockTolerance: 60 });
	if (!verifiedToken) {
		return new Response(JSON.stringify({ msg: 'Token is wrong' }), { status: 401 });
	}

 let resp = await context.env.ASSETS.fetch('ships.json');
	const Ships = await resp.json(); 

	resp = await context.env.ASSETS.fetch('meta.json');
	const meta = await resp.json(); 

	const result = await context.env.database.prepare(`
						SELECT Ship, Action, COUNT(*) AS action_count
						FROM Actions
						GROUP BY Ship, Action
					`).all();
	
	//first pass, invalidate invalid actions
	result.results.forEach((row) => {
		switch (row.Action) {
		  case 'repair':
			if (Ships[row.Ship].Wood <= 0) row.action_count = 0;
			break;
		  case 'fish':
			if (Ships[row.Ship].Food >= meta.MaxFood) row.action_count = 0;
			break;
		  case 'salvage':
			if (Ships[row.Ship].Wood >= meta.MaxWood) row.action_count = 0;
			break;
		}
	  });

	//second pass, fulfil actions
	result.results.forEach(({ Ship, Action, action_count }) => {
		switch (Action) {
			case 'repair':
				break;
			case 'fish':
				break;
			case 'salvage':
				break;
			case 'raid':
				break;
		}
		
		console.log(`${Ship} performed ${Action} ${action_count} times.`);
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

	return new Response(JSON.stringify({ msg: "Completed" }),{
		headers: { 'Content-Type': 'application/json' },
		status: 200,
	});
}
