import fs from 'fs';
import path from 'path';
import jwt from "jsonwebtoken";
import { fileURLToPath } from 'url';

const token = jwt.sign({
	nbf: Math.floor(Date.now() / 1000),      // Not before: Now
	exp: Math.floor(Date.now() / 1000) + (5 * 60) // Expires: Now + 5min
}, process.env.JWT_SECRET);

const resp = await fetch(`${process.env.WEBSITE}/API/ResolveTurn`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
});
const Ships = await resp.json();

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const filePath = path.join(__dirname, "Website/ships.json");
fs.mkdirSync(path.dirname(filePath), { recursive: true });
fs.writeFileSync(filePath, JSON.stringify(Ships,null,2));