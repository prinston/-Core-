let characterData = {};

// Create DB if it isn't real yet //
connection.query(`CREATE TABLE IF NOT EXISTS \`${config.mysql.database}\`.\`character\`(id VARCHAR(22), slot INT);`);

// Properly convert a value to save for mysql //
function convertValue(value, valueType) {
  if(value == undefined || value == null) return 'NULL';
  if(valueType.toUpperCase() == 'JSON') value = JSON.stringify(value);
  if(valueType.toUpperCase() == 'BOOLEAN') value = value?1:0;
  return `'${value}'`;
}

// Create new character data (only if the player selects new character) //
/*
* playerId: the discord id without 'discord:'
* characterId: the slot
*/
function createCharacterData(playerId, characterId) {
  let res = {}
  let keys = `\`id\`, \`slot\``;
  let values = `'${playerId}', '${characterId}'`;

  res.id = playerId;
  res.slot = characterId;

  for(let key in characterData) {
    res[key] = characterData[key].defaultValue;
    keys += `, \`${key}\``;
    values += `, ${convertValue(characterData[key].defaultValue, characterData[key].valueType)}`
  }
  connection.query(`INSERT INTO \`${config.mysql.database}\`.\`character\` (${keys}) VALUES (${values});`, (err, rst, fld) => {
    if(err) console.error(err);
  });
  return res;
}

// Register information to save per character //
/*
* name: unique id for the column in the db
* defaultValue: will set this value automatically (if new data all characters get this new value)
* valueType: the mysql data type
*/
function registerCharacterData(name, defaultValue = undefined, valueType = 'TEXT') {
  if(characterData[name] == undefined) {
    characterData[name] = {
      defaultValue: defaultValue,
      valueType: valueType
    }
    connection.query(`ALTER TABLE \`${config.mysql.database}\`.\`character\` ADD COLUMN \`${name}\` ${valueType};`, (err, res, fld) => {
      if(!err) connection.query(`UPDATE \`${config.mysql.database}\`.\`character\` SET \`${name}\` = ${convertValue(defaultValue, valueType)};`);
    });
    return true;
  }
  return false;
}

// Load a character's data //
/*
* playerId: discord id without 'discord:'
* characterId: the slot
* callback: once loaded run this
*/
function loadCharacterData(playerId, characterId, callback = undefined) {
  connection.query(`SELECT * FROM \`${config.mysql.database}\`.\`character\` WHERE \`id\`='${playerId}' AND \`slot\`='${characterId}'`, (err, rst, fld) => {
    if(err) return;
    if(rst.length != 0) {
      for(let index in rst) {
        let data = { id: rst[index].id, slot: rst[index].slot };
        for(let key in characterData) {
          let val = rst[index][key];
          if(characterData[key].valueType.toUpperCase() == 'BOOLEAN') val = val==0?false:true;
          if(characterData[key].valueType.toUpperCase() == 'JSON') val = JSON.parse(val);
          data[key] = val;
        }
        callback(data);
      }
    }
  });
}

function saveCharacterData(data, callback = undefined) {
  if(data.id != undefined && data.slot != undefined) {
    let str = ``;
    for(let key in characterData) {
      if(str != '') str += ', ';
      str += `\`${key}\`=${convertValue(data[key], characterData[key].valueType)}`
    }
    connection.query(`UPDATE \`${config.mysql.database}\`.\`character\` SET ${str} WHERE \`id\`='${data.id}' AND \`slot\`='${data.slot}';`, (err, rst, fld) => {
      if(callback != undefined) {
        if(err) {
          console.error(err);
          callback(false);
        }
        else callback(true);
      }
    });
  }
}

exports('registerCharacterData', registerCharacterData);
exports('createCharacterData', createCharacterData);
exports('loadCharacterData', loadCharacterData);
exports('saveCharacterData', saveCharacterData);

on('registerCharacterData', (name, defaultValue, type, callback = undefined) => {
  let res = registerCharacterData(name, defaultValue, type);
  if(callback != undefined) callback(res);
});
on('createCharacterData', (discordId, slot, callback = undefined) => {
  let res = createCharacterData(discordId, slot);
  if(callback != undefined) callback(res);
});
on('loadCharacterData', (discordId, slot, callback = undefined) => {
  loadCharacterData(discordId, slot, callback);
});
on('saveCharacterData', (data, callback = undefined) => {
  saveCharacterData(data, callback);
});

onNet('mysql:registerCharacterData', (name, defaultValue, type, callback = undefined) => {
  let res = registerCharacterData(name, defaultValue, type);
  if(callback != undefined) emitNet(callback, global.source, res);
});
onNet('mysql:createCharacterData', (discordId, slot, callback = undefined) => {
  let res = createCharacterData(discordId, slot);
  if(callback != undefined && res != undefined) emitNet(callback, global.source, res);
});
onNet('mysql:loadCharacterData', (discordId, slot, callback = undefined) => {
  let player = global.source;
  loadCharacterData(discordId, slot, (data) => {
    if(data != undefined && callback != undefined) emitNet(callback, player, res);
  });
});
onNet('mysql:saveCharacterData', (data, callback = undefined) => {
  let player = global.source;
  saveCharacterData(data, callback==undefined?undefined:(result) => { emitNet(callback, player, result); });
});

registerCharacterData('finishedCreation', false, 'BOOLEAN');
registerCharacterData('first_name', undefined, 'VARCHAR(32)');
registerCharacterData('last_name', undefined, 'VARCHAR(32)');
registerCharacterData('cash', config.starting.cash, 'INT');
registerCharacterData('bank', config.starting.bank, 'INT');
registerCharacterData('dob', { month: 1, day: 1, year: 1999 }, 'JSON');
registerCharacterData('position', { x: config.starting.position.x, y: config.starting.position.y, z: config.starting.position.z, h: config.starting.position.h}, 'JSON');
registerCharacterData('visual', {
  model: 'mp_m_freemode_01',
  inheritance: {
    mother: 0,
    father: 0,
    genetic: 0,
    shapeMix: 0,
    skinMix: 0, //Inverted
    geneticMix: 0
  },
  appearance: {
    feature: 0,
    eye: {
      color: 3,
      open: 0 //Inverted
    },
    nose: {
      width: 0,
      peak: {
        height: 0,
        length: 0, //Inverted
        bend: 0
      },
      bone: {
        height: 0, //Inverted
        twist: 0
      }
    },
    eyebrow: {
      height: 0, //Inverted
      length: 0
    },
    cheek: {
      width: 0, //Inverted
      bone: {
        height: 0, //Inverted
        width: 0
      }
    },
    lips: 0, //Inverted
    jaw: {
      width: 0,
      length: 0
    },
    chin: {
      height: 0,
      length: 0,
      width: 0,
      depth: 0 //Inverted
    },
    neck: 0
  },
  cosmetic: {
    head: {
      value: 0,
      texture: 0,
      palette: 0
    },
    blemishes: {
      value: 0,
      opacity: 0
    },
    hair: {
      value: 0,
      texture: 0,
      palette: 0,
      color: 0,
      highlight: 0,
    },
    facialhair: {
      value: 0,
      color: 0,
      opacity: 75,
    },
    eyebrow: {
      value: 0,
      color: 0,
      opacity: 75,
    },
    chesthair: {
      value: 0,
      color: 0,
      opacity: 25,
    },
    ageing: {
      value: 0,
      opacity: 0,
    },
    makeup: {
      value: 0,
      color: 0,
      opacity: 0,
    },
    blush: {
      value: 0,
      color: 0,
      opacity: 100,
    },
    lipstick: {
      value: 0,
      color: 0,
      opacity: 100,
    },
    complexion: {
      value: 0,
      opacity: 0,
    },
    sundamage: {
      value: 0,
      opacity: 0,
    },
    moles: {
      value: 0,
      opacity: 0,
    },
    bodyblemishes: {
      value: 0,
      opacity: 0,
    },
    bodyblemishes2: {
      value: 0,
      opacity: 0,
    },
  },
  clothing: {
    hat: [-1, 0, 1],
    glasses: [-1, 0, 1],
    ears: [-1, 0, 1],
    watch: [-1, 0, 1],
    bracelet: [-1, 0, 1],
    mask: [0, 0, 0],
    torso: [0, 0, 0],
    gloves: [0, 0, 0],
    leg: [0, 0, 0],
    bag: [0, 0, 0],
    shoes: [0, 0, 0],
    accessory: [0, 0, 0],
    undershirt: [0, 0, 0],
    armor: [0, 0, 0],
    badge: [0, 0, 0],
    overlay: [0, 0, 0]
  }
}, 'JSON');
registerCharacterData('hunger', 100, 'INT');
registerCharacterData('water', 100, 'INT');
// createCharacterData('inventory', {
//   clothes: {
//     hat: {},
//     glasses: {},
//     ear: {},
//     watch: {},
//     bracelet: {},
//     mask: {},
//     gloves: {},
//     legs: {},
//     bag: {},
//     feet: {},
//     accessory: {},
//     undershirt: {},
//     armor: {},
//     badge: {},
//     overshirt: {}
//   },
//   hotbar: {
//     1: {},
//     2: {},
//     3: {},
//     4: {},
//     5: {},
//     6: {},
//     7: {},
//     8: {},
//     9: {},
//     0: {}
//   },
//   inventory: {}
// }, 'JSON')
