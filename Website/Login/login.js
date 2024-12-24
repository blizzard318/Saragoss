async function login() {
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;

	const response = await fetch('/login', {
	  method: 'POST',
	  body: JSON.stringify({ email, password }),
	  headers: { 'Content-Type': 'application/json' },
	});

	const result = await response.json();
	console.log(result);  // Handle the response (e.g., success or error message)
}