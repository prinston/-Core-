function sendMessage(json) {
  SendNuiMessage(JSON.stringify(json));
}

function openInventory() {
  sendMessage({ type: 'open' });
}

function closeInventory() {
  sendMessage({ type: 'close' });
}

on('inventory:open', openInventory);
on('inventory:close', closeInventory);

let loader = setInterval(() => {
  if(exports.keybinder != undefined) {
    if(exports.keybinder.registerKeybind != undefined) {
      exports.keybinder.registerKeybind('inventory:open', 'inventory:open', '[Inventory] Open', true, 'I');
      clearInterval(loader);
    }
  }
}, 10);
