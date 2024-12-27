function toggle() {
  const x = document.getElementById("register");
  const y = document.getElementById("login");
  
  if (x.style.display === "none") {
    x.style.display = "block";
    y.style.display = "none";
  } else {
    x.style.display = "none";
    y.style.display = "block";
  }
}
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
async function register() {
	const password = document.getElementById('reg-pw').value;
	const rpassword = document.getElementById('reg-rpw').value;

	document.getElementById('pw-match').style.display = (password === rpassword) ? "none" : "block";

	const email = document.getElementById('reg-email').value;

	const response = await fetch('/register', {
	  method: 'POST',
	  body: JSON.stringify({ email, password }),
	  headers: { 'Content-Type': 'application/json' },
	});

	const result = await response.json();
	console.log(result);  // Handle the response (e.g., success or error message)
}