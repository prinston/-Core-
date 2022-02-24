const fs = require('fs');

let config = JSON.parse(fs.readFileSync(GetResourcePath(GetCurrentResourceName()) + '/../config.json').toString());

exports('config', () => { return JSON.parse(fs.readFileSync(GetResourcePath(GetCurrentResourceName()) + '/../config.json').toString()) });
exports('vehicles', () => { return JSON.parse(fs.readFileSync(GetResourcePath(GetCurrentResourceName()) + '/../vehicles.json').toString())} );
exports('client_config', () => { return JSON.parse(fs.readFileSync(GetResourcePath(GetCurrentResourceName()) + '/../config.json').toString()).player });
exports('locations', () => { return JSON.parse(fs.readFileSync(GetResourcePath(GetCurrentResourceName()) + '/../locations.json').toString())} );
exports('getConfig', (filename) => { return JSON.parse(fs.readFileSync(GetResourcePath(GetCurrentResourceName()) + '/../' + filename + '.json').toString())} );

onNet('config', (callback) => { if(callback != undefined) emitNet(callback, global.source, JSON.parse(fs.readFileSync(GetResourcePath(GetCurrentResourceName()) + '/../config.json').toString())); });
onNet('client_config', (callback) => { if(callback != undefined) emitNet(callback, global.source, JSON.parse(fs.readFileSync(GetResourcePath(GetCurrentResourceName()) + '/../config.json').toString()).player); });
onNet('vehicles', (callback) => { if(callback != undefined) emitNet(callback, global.source, JSON.parse(fs.readFileSync(GetResourcePath(GetCurrentResourceName()) + '/../vehicles.json').toString())); });
onNet('locations', (callback) => { if(callback != undefined) emitNet(callback, global.source, JSON.parse(fs.readFileSync(GetResourcePath(GetCurrentResourceName()) + '/../locations.json').toString())); });
onNet('config:getConfig', (filename, callback) => { if(callback != undefined) emitNet(callback, global.source, JSON.parse(fs.readFileSync(GetResourcePath(GetCurrentResourceName()) + '/../' + filename + '.json').toString())); });
