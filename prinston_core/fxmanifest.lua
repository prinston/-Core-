fx_version 'cerulean'
games { 'gta5' }

author 'Prinston'
description 'Prinston Economic Core'
version '0.1'
dependency 'menu_manager'
dependency 'mysql'
dependency 'keybinder'
dependency 'helper'

ui_page 'ui.htm'

files {
  'ui.htm',
  'ui.js',
  'ui.css'
}

shared_script 'src/shared.js'

server_script 'src/server.js'

client_script 'src/client_helper.js'
client_script 'src/client.js'
client_script 'src/camera.js'
client_script 'src/economy.js'

client_script 'src/menu/menuCreator.js'
client_script 'src/menu/introMenu.js'
client_script 'src/menu/infoMenu.js'
client_script 'src/menu/inheritanceMenu.js'
client_script 'src/menu/appearanceMenu.js'
client_script 'src/menu/cosmeticMenu.js'
client_script 'src/menu/clothingMenu.js'

client_script 'src/character/torso.js'
client_script 'src/character/character.js'
client_script 'src/character/characterCreate.js'
client_script 'src/character/spawnCharacter.js'
client_script 'src/character/characterSelect.js'
