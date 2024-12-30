document.addEventListener('DOMContentLoaded', () => {
  try {
	const response = await fetch('../ships.csv');
	if (!response.ok) throw new Error('Failed to fetch CSV file');

	const csvText = await response.text();
	const [...data] = csvText.split(',');

	const dropdown = document.getElementById('dynamicDropdown');
	dropdown.innerHTML = '';

	data.forEach((value) => {
	  const option = document.createElement('option');
	  option.value = option.textContent = value;
	  dropdown.appendChild(option);
	});

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
  } catch (error) {
	console.error('Error loading dropdown:', error);
	alert('Failed to load dropdown options');
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
