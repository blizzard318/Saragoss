import fs from 'fs';
import path from 'path';
//import jwt from "@tsndr/cloudflare-worker-jwt";
import jwt from "jsonwebtoken";

// Why add things to the token and not to a message body?
// Because GET requests cannot have message bodies.
//const token = await jwt.sign({
	'KV_ID': process.env.KV_ID,
	'nbf': Math.floor(Date.now() / 1000),
	'exp': Math.floor(Date.now() / 1000) + (5 * 60)
}, process.env.JWT_SECRET);

const token = jwt.sign({
	KV_ID: process.env.KV_ID,
	nbf: Math.floor(Date.now() / 1000),      // Not before: Now
	exp: Math.floor(Date.now() / 1000) + (5 * 60) // Expires: Now + 5min
}, process.env.JWT_SECRET);

const response = await fetch('/API/GithubAction', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
});

const { KV_ID } = await response.json();
fs.appendFile(process.env.GITHUB_ENV, `KV_ID=${KV_ID}`, (err) => {
  if (err) {
    console.error('Error writing to GITHUB_ENV file:', err);
    process.exit(1);
  }
  console.log(`Successfully updated ${existingVariableName} to: ${newValue}`);
});

const weatherOptions = ["Cold", "Foggy", "Hot", "Stormy", "Windy", "Calm"];
const weatherData = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
const filePath = path.join(__dirname, "Website/weather.txt");

// Ensure the directory exists
fs.mkdirSync(path.dirname(filePath), { recursive: true });

// Write weather data to the file
fs.writeFileSync(filePath, weatherData);
