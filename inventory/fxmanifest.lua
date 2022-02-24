fx_version 'cerulean'
games { 'gta5' }

author 'Prinston'
description 'Inventory Manager'
version '0.1'
dependency 'mysql'
dependency 'prinston_core'
dependency 'keybinder'

ui_page 'ui.htm'

files {
  'ui.htm',
  'ui.js',
  'ui.css'
}

server_script 'server.js'

client_script 'client.js'
client_script 'items.js'
