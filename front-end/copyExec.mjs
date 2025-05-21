import fs from "fs";
import path from "path";

const source = path.resolve("./exec.ps1");
const destination = path.resolve("out/exec.ps1");

// Ensure the destination directory exists
fs.mkdirSync(path.dirname(destination), { recursive: true });

// Copy the file
fs.copyFileSync(source, destination);
console.log(`Copied exec.ps1 to ${destination}`);
