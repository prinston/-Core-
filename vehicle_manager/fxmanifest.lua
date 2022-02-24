fx_version 'cerulean'
games { 'gta5' }

author 'Prinston'
description 'Vehicle Manager'
version '0.1'
dependency 'keybinder'
dependency 'helper'
dependency 'ui_manager'
dependency 'prinston_core'

server_script 'src/server.js'

client_script 'config.js'
client_script 'src/client.js'
client_script 'src/fuel.js'
client_script 'src/tireburst.js'
client_script 'src/failure.js'
client_script 'src/manual.js'
client_script 'src/vehicle.js'
