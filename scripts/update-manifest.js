var file_system = require('fs');

let packageJson = JSON.parse(file_system.readFileSync('package.json'))
let manifest = JSON.parse(file_system.readFileSync('manifest.json'));
manifest.version = packageJson.version;

file_system.writeFileSync('manifest.json', JSON.stringify(manifest));
