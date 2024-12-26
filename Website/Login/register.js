async function register() {
	const password = document.getElementById('reg-pw').value;
	const rpassword = document.getElementById('reg-rpw').value;

	document.getElementById('pw-match').style.display = (password === rpassword) ? "none" : "block";

	const email = document.getElementById('reg-email').value;

	/*const response = await fetch('/register', {
	  method: 'POST',
	  body: JSON.stringify({ email, password }),
	  headers: { 'Content-Type': 'application/json' },
	});

	const result = await response.json();
	console.log(result);  // Handle the response (e.g., success or error message)*/
}