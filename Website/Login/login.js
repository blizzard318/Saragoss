function toggle() {
  const x = document.getElementById("register");
  const y = document.getElementById("login");
  
  document.getElementById('login-email').value = document.getElementById('login-pw').value = document.getElementById('reg-pw').value = document.getElementById('reg-rpw').value = document.getElementById('reg-email').value = "";
  
  if (x.style.display === "none") {
    x.style.display = "block";
    y.style.display = "none";
  } else {
    x.style.display = "none";
    y.style.display = "block";
  }
}
async function login() {
	const email = document.getElementById('login-email').value;
	const password = document.getElementById('login-pw').value;

	const response = await fetch('/login', {
	  method: 'GET',
	  body: JSON.stringify({ email, password }),
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
			
			window.location.href = result.CreateCharacter ? "../CreateCharacter" : "../Game";
			break;
	}
}
async function register() {
	const  password = document.getElementById('reg-pw' ).value;
	const rpassword = document.getElementById('reg-rpw').value;

	if (password !== rpassword){
		document.getElementById('pw-match').style.display = "block";
	} else {
		document.getElementById('pw-match').style.display = "none";
		
		const email = document.getElementById('reg-email').value;

		const response = await fetch('/login', {
		  method: 'POST',
		  body: JSON.stringify({ email, password }),
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