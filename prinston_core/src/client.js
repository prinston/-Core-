let discordId;
let config;
let roles;
let time;
let characterInfo = {};
let character;

onNet('prinston_core:time', (timeIn) => {
  time = timeIn;
})

onNet('prinston_core:roles', (rolesIn) => {
  roles = rolesIn;
})

onNet('prinston_core:update', (discordIdIn, configIn) => {
  discordId = discordIdIn;
  config = configIn;
});

onNet('prinston_core:getCharacterInfo', (characterInfoIn) => {
  if(characterInfo != undefined) characterInfo[characterInfoIn.slot] = characterInfoIn;
});

let canSavePosition = false;

function uploadInfo() {
  if(character != undefined) {
    if(character.finishedCreation && canSavePosition) {
      if(DoesEntityExist(PlayerPedId())) {
        let coords = GetEntityCoords(PlayerPedId());
        character.position.x = coords[0];
        character.position.y = coords[1];
        character.position.z = coords[2];
        character.position.h = GetEntityHeading(PlayerPedId());
      }
    }
    emitNet('prinston_core:saveCharacterData', character);
  }
}

on('onResourceStop', (resource) => {
  uploadInfo();
});

setInterval(() => {
  uploadInfo();
}, 30000);

emitNet('prinston_core:request');
exports('discordId', () => { return discordId; });
exports('config', () => { return config; });
exports('character', () => { return character; });
exports('ready', () => { return character != undefined && character.finishedCreation; });

let inrange = false;
on('prinston_core:inrange', (i) => { inrange = i; });

setTick(() => {
  exports.helper.drawText('In Range: ' + inrange, 5, 15);
})

onNet('prinston_core:spawnlocations', (locations) => {
  for(let i in locations.guns) {
    exports.helper.createBlip('ammunation' + i, {
      x: locations.guns[i][0],
      y: locations.guns[i][1],
      z: locations.guns[i][2],
      name: 'Ammunation',
      color: 0,
      sprite: 110
    });
  }
  for(let i in locations.clothing) {
    exports.helper.createBlip('clothing' + i, {
      x: locations.clothing[i][0],
      y: locations.clothing[i][1],
      z: locations.clothing[i][2],
      name: 'Clothing Shop',
      color: 0,
      sprite: 73
    });
  }
  for(let i in locations.tattoo) {
    exports.helper.createBlip('tattoo' + i, {
      x: locations.tattoo[i][0],
      y: locations.tattoo[i][1],
      z: locations.tattoo[i][2],
      name: 'Tattoo Parlor',
      color: 0,
      sprite: 75
    });
  }
  for(let i in locations.barber) {
    exports.helper.createBlip('barber' + i, {
      x: locations.barber[i][0],
      y: locations.barber[i][1],
      z: locations.barber[i][2],
      name: 'Barber Shop',
      color: 0,
      sprite: 71
    });
  }
  for(let i in locations.market) {
    exports.helper.createBlip('market' + i, {
      x: locations.market[i][0],
      y: locations.market[i][1],
      z: locations.market[i][2],
      name: 'Market',
      color: 0,
      sprite: 59
    });
  }
  for(let i in locations.lscustoms) {
    exports.helper.createBlip('lscustoms' + i, {
      x: locations.lscustoms[i][0],
      y: locations.lscustoms[i][1],
      z: locations.lscustoms[i][2],
      name: 'LS Customs',
      color: 0,
      sprite: 777
    });
  }
});
emitNet('locations', 'prinston_core:spawnlocations');

exports.helper.createInteractionLocation('testLocation', {
  name: 'Test Location',
  radius: 3,
  event: 'prinston_core:inrange',
  coords: [-75.08, -818.97, 326.18],
  blip: {
    use: true,
    sprite: 306,
    color: 23
  },
  marker: {
    type: 25,
    color: [255, 255, 255, 255]
  }
});
