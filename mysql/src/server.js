const mysql = require('mysql');

const config = exports.config.config();

let connection = new mysql.createConnection({
  host: config.mysql.host,
  port: config.mysql.port,
  user: config.mysql.username,
  password: config.mysql.password
});

connection.connect((err) => {
  if(err) console.error(err);
});

connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.mysql.database}\`;`, (err, res, fld) => {
  if(err) console.error(err);
});

exports('getConnection', () => { return connection; });
