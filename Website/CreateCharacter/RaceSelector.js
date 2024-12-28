// URL of your CSV file
    const csvUrl = 'https://saragoss.pages.dev/ships.csv';

    // Function to fetch and parse CSV
    async function populateDropdown() {
      try {
        // Fetch the CSV file
        const response = await fetch(csvUrl);
        if (!response.ok) throw new Error('Failed to fetch CSV file');

        const csvText = await response.text();

        // Extract headers and rows
        const [...data] = csvText.split(',');

        const dropdown = document.getElementById('dynamicDropdown');
        dropdown.innerHTML = ''; // Clear existing options

        // Add options dynamically
        data.forEach((value) => {
          const option = document.createElement('option');
          option.value = value;
          option.textContent = value;
          dropdown.appendChild(option);
        });
      } catch (error) {
        console.error('Error loading dropdown:', error);
        alert('Failed to load dropdown options');
      }
    }

    // Call the function on page load
    document.addEventListener('DOMContentLoaded', populateDropdown);