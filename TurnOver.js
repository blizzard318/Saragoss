const fs = require("fs");
const path = require("path");


const response = await fetch('/API/GithubAction', {
  method: 'POST',
  body: JSON.stringify({ jwt }),
  headers: { 'Content-Type': 'text/csv' },
});

const weatherOptions = ["Cold", "Foggy", "Hot", "Stormy", "Windy", "Calm"];
const weatherData = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
const filePath = path.join(__dirname, "Website/weather.txt");

// Ensure the directory exists
fs.mkdirSync(path.dirname(filePath), { recursive: true });

// Write weather data to the file
fs.writeFileSync(filePath, weatherData);
