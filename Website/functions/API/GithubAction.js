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

    const result = await context.env.database.prepare('SELECT * FROM Actions;').all();
	result.results
	//TO-DO: implement pagination
	
	await context.env.database.prepare('DELETE FROM Actions;').all();
	
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
