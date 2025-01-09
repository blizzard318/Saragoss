import jwt from '@tsndr/cloudflare-worker-jwt';

export async function onRequestGet(context) {
	const token = await jwt.sign({
        sub: "1234",
        name: "John Doe",
        email: "john.doe@gmail.com"
    }, "secret");
	
	return new Response(JSON.stringify(numbers),{
		headers: { 'Content-Type': 'application/json' },
		status: 200,
	});
}