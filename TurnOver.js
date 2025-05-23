import fs from 'fs';
import path from 'path';
import jwt from "jsonwebtoken";
import { fileURLToPath } from 'url';
//import jwt from "@tsndr/cloudflare-worker-jwt";

const token = jwt.sign({
	nbf: Math.floor(Date.now() / 1000),      // Not before: Now
	exp: Math.floor(Date.now() / 1000) + (5 * 60) // Expires: Now + 5min
}, process.env.JWT_SECRET);

const resp = await fetch(`${process.env.WEBSITE}/API/GithubAction`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
});

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
let filePath = path.join(__dirname, "Website/ships.json");
fs.mkdirSync(path.dirname(filePath), { recursive: true });
const Ships = await resp.json();
fs.writeFileSync(filePath, JSON.stringify(Ships,null,2));

const weatherOptions = ["Cold", "Foggy", "Hot", "Stormy", "Windy", "Calm"];
const weatherData = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
filePath = path.join(__dirname, "Website/weather.txt");
fs.mkdirSync(path.dirname(filePath), { recursive: true });
fs.writeFileSync(filePath, weatherData);
