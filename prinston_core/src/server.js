const config = exports.config.config();

setInterval(() => {
  let date = new Date();
  emitNet('prinston_core:time', -1, {
    month: date.getMonth() + 1,
    day: date.getDate(),
    year: date.getFullYear()
  });
}, 60000);


const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
let card;
if(config.discord.use) {
  card = JSON.stringify({
      "type": "AdaptiveCard",
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "version": "1.5",
      "body": [
          {
              "type": "Container",
              "items": [
                  {
                      "type": "TextBlock",
                      "wrap": true,
                      "text": "${discord}",
                      "fontType": "Default",
                      "style": "heading",
                      "isSubtle": false,
                      "weight": "Bolder",
                      "size": "ExtraLarge",
                      "horizontalAlignment": "Center",
                      "color": "Warning"
                  },
                  {
                      "type": "ColumnSet",
                      "columns": [
                          {
                              "type": "Column",
                              "width": "stretch",
                              "items": [
                                  {
                                      "type": "Image",
                                      "url": "https://i.imgur.com/wYsGSfW.png",
                                      "selectAction": {
                                          "type": "Action.Submit",
                                          "id": "join"
                                      }
                                  }
                              ]
                          },
                          {
                              "type": "Column",
                              "width": "stretch"
                          },
                          {
                              "type": "Column",
                              "width": "stretch",
                              "items": [
                                  {
                                      "type": "Image",
                                      "url": "https://i.imgur.com/2WWBGGX.png",
                                      "selectAction": {
                                          "type": "Action.OpenUrl",
                                          "url": "https://discord.gg/FDqkUmd5nB"
                                      }
                                  }
                              ]
                          }
                      ],
                      "minHeight": "100px"
                  }
              ]
          }
      ],
      "backgroundImage": {
          "url": "https://www.igta5.com/images/m/official-screenshot-classy-windsor.jpg"
      }
  });

  client.on('ready', () => {});
  client.login(config.discord.token);
}

function retrieveDiscordId(playerId) {
  for(let i = 0; i < GetNumPlayerIdentifiers(playerId); i++) {
    let id = GetPlayerIdentifier(playerId, i);
    if(id.toLowerCase().startsWith('discord:')) {
      return id.replace('discord:', '');
    }
  }
  return undefined;
}

function getRoles(discordId, callback = undefined) {
  let roles = [];
  if(config.discord.use) {
    client.guilds.fetch(config.discord.guildId).then((guild) => {
      console.log(discordId);
      guild.members.fetch(discordId).then((member) => {
        let cache = member.roles.cache;
        cache.each((value, key, col) => {
          console.log(`${key}: ${value}`);
        });
      }).catch((err) => { if(callback != undefined) callback(roles); });
    }).catch((err) => { if(callback != undefined) callback(roles); });
  } else if(callback != undefined) callback(roles);
}

onNet('prinston_core:request', () => {
  let player = global.source;
  let discordId = retrieveDiscordId(player);
  //JSON.parse(fs.readFileSync(GetResourcePath(GetCurrentResourceName()) + '/equivalent.json').toString())
  emitNet('prinston_core:update', player, discordId, config.player);
  let date = new Date();
  emitNet('prinston_core:time', player, {
    month: date.getMonth() + 1,
    day: date.getDate(),
    year: date.getFullYear()
  });
  getRoles(discordId, (roles) => {
    console.log(roles);
    console.log('Finished Roles')
    emitNet('prinston_core:roles', player, roles);
  });
  let loader = setInterval(() => {
    if(exports.mysql != undefined) {
      if(exports.mysql.loadCharacterData != undefined) {
        for(let i = 0; i < config.player.characterSelection.characterCount; i++) {
          exports.mysql.loadCharacterData(discordId, i, (data) => {
            if(data != undefined && data.slot != undefined) emitNet('prinston_core:getCharacterInfo', player, data);
          });
          clearInterval(loader);
        }
      }
    }
  }, 50);
});

on('playerConnecting', (name, setKickReason, deferrals) => {
  deferrals.defer();
  let player = global.source;
  setTimeout(() => {
    let discordId = retrieveDiscordId(player);
    deferrals.update(`Hello, ${name}.\nWe are checking your discord status\nYour discord ID is ${discordId}`);
    if(config.discord.use) {
      if(discordId == undefined) {
        deferrals.done('You must allow your discord to connect to FiveM, try restarting both if this problem persists');
      } else {
        client.guilds.fetch(config.discord.guildId).then((guild) => {
          guild.members.fetch(discordId).then((user) => {
            let inter = setInterval(() => {
              deferrals.presentCard(card.replace('${discord}', user.user.tag), (data, raw) => {
                clearInterval(inter);
                deferrals.done();
              });
            }, 500);
          }).catch((err) => {
            let inter = setInterval(() => {
              deferrals.presentCard(card.replace('${discord}', 'You are not connected to the official discord, please do so with the button below'), (data, raw) => {
                client.guilds.fetch(config.discord.guildId).then((guild) => {
                  guild.members.fetch(discordId).then((user) => {
                    clearInterval(inter);
                    deferrals.done();
                  });
                });
                clearInterval(inter);
                deferrals.done('Have a great day');
              });
            }, 500);
          });
        });
      }
    } else {
      if(discordId == undefined) deferrals.done('You must allow your discord to connect to FiveM, try restarting both if this problem persists');
      else deferrals.done();
    }
  }, 1);
});

onNet('prinston_core:saveCharacterData', (data) => {
  exports.mysql.saveCharacterData(data);
})

onNet('saveJson', (file, data) => {
  fs.writeFileSync(GetResourcePath(GetCurrentResourceName()) + '/' + file + '.json', JSON.stringify(data, null, 2));
});
