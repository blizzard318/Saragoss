document.addEventListener('DOMContentLoaded', async (event) => {
	const csvresponse = await fetch('../races.csv');
	const csvText = await csvresponse.text();
	const [...data] = csvText.split(',');

	const dropdown = document.getElementById('ShipDropdown');
	dropdown.innerHTML = '';

	data.forEach((value) => {
	  const option = document.createElement('option');
	  option.value = option.textContent = value;
	  dropdown.appendChild(option);
	});

if (sessionStorage.getItem("name")){
  document.getElementById('char-name').value = sessionStorage.getItem("name");
			document.getElementById('ShipDropdown').value = sessionStorage.getItem("ship");
}else{
	const response = await fetch('/API/character', {
	  method: 'GET',
	  headers: { 'Content-Type': 'application/json' },
	});
	switch (response.status) {
		case 401:
			window.location.replace("../Login");
			break;
		case 200:
			const result = await response.json();
			const character = result.character;
			document.getElementById('char-name').value = character.name;
			document.getElementById('ShipDropdown').value = character.ship;
			break;
	}
}
});

async function CreateCharacter(){
	const name = document.getElementById('char-name').value;
	
	if (name === "")
	{
		document.getElementById('incomplete').style.display = "block";
		return;
	}
	
	const ship = document.getElementById('ShipDropdown').value;
	
	const response = await fetch('/API/character', {
	  method: 'PUT',
	  body: JSON.stringify({ name, ship }),
	  headers: { 'Content-Type': 'application/json' },
	});

	switch (response.status) {
		case 401:
			window.location.replace("../Login");
			break;
		case 404:
			document.getElementById('incomplete').style.display = 'block';
			break;
		case 200: //successful change
			sessionStorage.setItem("name", name);
			sessionStorage.setItem("ship", ship);
			break;
	}
}
