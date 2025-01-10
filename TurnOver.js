import fs from 'fs';
import path from 'path';
import jwt from "jsonwebtoken";
import { fileURLToPath } from 'url';
//import jwt from "@tsndr/cloudflare-worker-jwt";

const token = jwt.sign({
	nbf: Math.floor(Date.now() / 1000),      // Not before: Now
	exp: Math.floor(Date.now() / 1000) + (5 * 60) // Expires: Now + 5min
}, process.env.JWT_SECRET);

await fetch(`${process.env.WEBSITE}/API/GithubAction`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
});

const weatherOptions = ["Cold", "Foggy", "Hot", "Stormy", "Windy", "Calm"];
const weatherData = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const filePath = path.join(__dirname, "Website/weather.txt");

// Ensure the directory exists
fs.mkdirSync(path.dirname(filePath), { recursive: true });

// Write weather data to the file
fs.writeFileSync(filePath, weatherData);
