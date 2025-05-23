async function DoAction(action) {
	const response = await fetch('/API/action', {
	  method: 'POST',
	  body: JSON.stringify({ action }),
	  headers: { 'Content-Type': 'application/json' },
	});

	switch (response.status) {
		case 400:
			document.getElementById('login-error').style.display = "block";
			break;
		case 401:
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