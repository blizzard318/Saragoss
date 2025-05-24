document.addEventListener('DOMContentLoaded', async (event) => {
const csvresponse = await fetch('../ships.csv');
	const csvText = await csvresponse.text();
	const [...ships] = csvText.split(',');
const raidContainer = document.getElementById("raid-buttons");

// Loop through races and create buttons dynamically
ships.forEach(ship => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "greenbtn";
    button.textContent = `Go Out and Raid (${ship})`;
    button.onclick = () => DoAction(`raid-${ship.toLowerCase()}`); // Action format: raid-human, raid-elf, etc.
    
    raidContainer.appendChild(button); // Add button to the div
});
});

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