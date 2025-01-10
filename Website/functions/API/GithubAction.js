import jwt from '@tsndr/cloudflare-worker-jwt';
//Why not make a scheduled cloudflare worker instead of this github action cronjob?
//Because then I'll have 2 cron jobs.
export async function onRequestGet(context) {  
	const authorization = context.request.headers.get('Authorization');
	if (!authorization) {
		return new Response(JSON.stringify(msg: 'Authorization header is missing'), { status: 401 });
	}
	
	const token = authorization.split(' ')[1];
	if (!token) {
		return new Response(JSON.stringify(msg: 'Token is missing'), { status: 401 });
	}
	
	const verifiedToken = await jwt.verify(token, context.env.JWT_SECRET, { clockTolerance: 60 });
	if (!verifiedToken) {
		return new Response(JSON.stringify(msg: 'Token is wrong'), { status: 401 });
	}

	const characters = await context.env.Characters.list();
	//TO-DO: implement pagination
	
	//Delete the old actions kv (no point awaiting)
	fetch(`https://api.cloudflare.com/client/v4/accounts/${context.env.CLOUDFLARE_ID}/storage/kv/namespaces/${verifiedToken.payload.KV_ID}`, {
	  method: 'DELETE',
	  headers: {
		'Authorization': `Bearer ${context.env.CLOUDFLARE_TOKEN}`
	  }
	});//lmao I don't really know what to do if this fails.
	
	//Get current date in Singapore
	const singaporeDate = new Date().toLocaleString('en-GB', {
		timeZone: 'Asia/Singapore',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});

	//Create new actions kv
	const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${context.env.CLOUDFLARE_ID}/storage/kv/namespaces`, {
	  method: 'POST',
	  body: JSON.stringify({
		  title: `Saragoss Actions ${singaporeDate}`
	  }),
	  headers: {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${CLOUDFLARE_TOKEN}`
	  }
	});
	const { result } = await response.json();

	return new Response(JSON.stringify({ KV_ID: result.id }),{
		headers: { 'Content-Type': 'application/json' },
		status: 200,
	});
}
