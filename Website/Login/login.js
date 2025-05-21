function toggle() {
  const register = document.getElementById("register");
  const login = document.getElementById("login");
  
  document.getElementById('login-email').value = document.getElementById('login-pw').value = document.getElementById('reg-pw').value = document.getElementById('reg-rpw').value = document.getElementById('reg-email').value = "";
  
  if (register.style.display === "none") {
    register.style.display = "block";
    login.style.display = "none";
  } else {
    register.style.display = "none";
    login.style.display = "block";
  }
}
async function login() {
	const email = document.getElementById('login-email').value;
	const password = document.getElementById('login-pw').value;
	const method = 'login';

	const response = await fetch('/API/login', {
	  method: 'POST',
	  body: JSON.stringify({ email, password, method }),
	  headers: { 'Content-Type': 'application/json' },
	});

	switch (response.status) {
		case 400:
			document.getElementById('login-error').style.display = "block";
			break;
		case 200:
			document.getElementById('login-error').style.display = "none";
			
			const result = await response.json();
			console.log(result);  // Handle the response (e.g., success or error message)
			sessionStorage.putItem("uuid", result.uuid);
			sessionStorage.putItem("name", result.name);
			sessionStorage.putItem("ship", result.ship);
			window.location.href = !result.ship ? "../CreateCharacter" : "../Game";
			break;
	}
}
async function register() {
	const  password = document.getElementById('reg-pw' ).value;
	const rpassword = document.getElementById('reg-rpw').value;
	const method = 'register';

	if (password !== rpassword){
		document.getElementById('pw-match').style.display = "block";
	} else {
		document.getElementById('pw-match').style.display = "none";
		
		const email = document.getElementById('reg-email').value;

		const response = await fetch('/API/login', {
		  method: 'POST',
		  body: JSON.stringify({ email, password, method }),
		  headers: { 'Content-Type': 'application/json' },
		});

		switch (response.status) {
			case 400:
				break;
			case 201:
				document.getElementById('email-confirm').style.display = "block";
				break;
		}
		const result = await response.json();
		console.log(result);  // Handle the response (e.g., success or error message)
	}
}
