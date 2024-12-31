document.addEventListener('DOMContentLoaded', async () => {
document.getElementById('test').innerHTML = 'pre-fetch';
	const csvresponse = await fetch('../ships.csv');
document.getElementById('test').innerHTML = 'post-fetch';

	if (csvresponse.ok){
	const csvText = await csvresponse.text();
document.getElementById('test').innerHTML = csvText;
	const [...data] = csvText.split(',');

	const dropdown = document.getElementById('ShipDropdown');
	dropdown.innerHTML = '';

	data.forEach((value) => {
	  const option = document.createElement('option');
	  option.value = option.textContent = value;
	  dropdown.appendChild(option);
	});
 }else{
document.getElementById('test').innerHTML = 'not okay';
}

	const response = await fetch('/API/character', {
	  method: 'GET',
	  headers: { 'Content-Type': 'application/json' },
	});
	switch (response.status) {
		case 400:
			window.location.replace("../Login");
			break;
		case 200:
			const result = await response.json();
			const character = result.character;
			document.getElementById('char-name').value = character.name;
			document.getElementById('ShipDropdown').value = character.ship;
			break;
	}
});

async function CreateCharacter(){
	const name = document.getElementById('char-name').value;
	const ship = document.getElementById('ShipDropdown').value;
	
	const response = await fetch('/API/character', {
	  method: 'PUT',
	  body: JSON.stringify({ name, ship }),
	  headers: { 'Content-Type': 'application/json' },
	});
	switch (response.status) {
		case 400:
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
