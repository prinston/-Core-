// Create DB if it isn't real yet //
connection.query(`CREATE TABLE IF NOT EXISTS \`${config.mysql.database}\`.\`transactions\`(id VARCHAR(22), slot INT, time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, amount FLOAT, description TEXT);`);

const transactionKeys = '`id`, `slot`, `amount`, `description`';
function createTransaction(character, amount, reason, callback = undefined) {
  if(character != undefined && character.id != undefined && character.slot != undefined) {
    connection.query(`INSERT INTO \`${config.mysql.database}\`.\`transactions\` (${transactionKeys}) VALUES ('${character.id}', '${character.slot}', '${amount}', '${reason}');`, (err, res, fld) => {
      if(callback != undefined) callback(err == undefined);
    });
  } else if(callback != undefined) callback(false);
}

exports('createTransaction', (character, amount, reason, callback) => {
  createTransaction(character, amount, reason, (data) => {
    if(callback != undefined) callback(data)
  });
});
onNet('mysql:createTransaction', (character, amount, reason, callback) => {
  let player;
  if(callback != undefined) {
    player = global.source;
  }
  createTransaction(character, amount, reason, (data) => {
    if(callback != undefined) emitNet(callback, player, data, amount, reason);
  });
});
