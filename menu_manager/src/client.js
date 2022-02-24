function sendMessage(json) {
  SendNuiMessage(JSON.stringify(json));
}

function openMenu(name, options = {}, back = undefined) {
  sendMessage({
    type: 'open',
    name: name,
    options: options,
    back: back
  })
}

function closeMenu(name) {
  sendMessage({
    type: 'close',
    name: name
  });
}

function updateMenu(name, optionName, attributeName, attributeValue) {
  sendMessage({
    type: 'update',
    name: name,
    option: optionName,
    attribute: attributeName,
    value: attributeValue
  });
}

let activeMenu = '';

RegisterNuiCallbackType('activeMenu');
on('__cfx_nui:activeMenu', (data, callback) => {
  activeMenu = data.menu;
  callback({});
});

RegisterNuiCallbackType('playsound');
on('__cfx_nui:playsound', (data, callback) => {
  switch(data.type) {
    case 'nav':
      PlaySound(-1, 'NAV_UP_DOWN', 'HUD_MINI_GAME_SOUNDSET', 0, 0, 1);
      break;
    case 'enter':
      PlaySound(-1, 'SELECT', 'HUD_MINI_GAME_SOUNDSET', 0, 0, 1);
      break;
    case 'back':
      PlaySound(-1, 'CANCEL', 'HUD_MINI_GAME_SOUNDSET', 0, 0, 1);
      break;
  }
  callback({});
});

RegisterNuiCallbackType('emit');
on('__cfx_nui:emit', (data, callback) => {
  if(data.event.length != 0) emit(data.event, ...data.data);
  callback({});
});

function navigateMenu(direction, isShift = false, isControl = false) {
  if(!IsPauseMenuActive()) {
    sendMessage({
      type: 'input',
      direction: direction,
      isShift: isShift,
      isControl: isControl
    });
  }
}

let up = {
  last: false,
  down: false,
  ticks: 0,
  ticksLast: 1000
}
let down = {
  last: false,
  down: false,
  ticks: 0,
  ticksLast: 1000
}
let left = {
  last: false,
  down: false,
  ticks: 0,
  ticksLast: 1000
}
let right = {
  last: false,
  down: false,
  ticks: 0,
  ticksLast: 1000
}

on('+menu_manager:up', () => { up.down = true; });
on('-menu_manager:up', () => { up.down = false; up.ticks = 0; });
on('+menu_manager:down', () => { down.down = true; });
on('-menu_manager:down', () => { down.down = false; down.ticks = 0 });
on('+menu_manager:left', () => { left.down = true; });
on('-menu_manager:left', () => { left.down = false; left.ticks = 0 });
on('+menu_manager:right', () => { right.down = true; });
on('-menu_manager:right', () => { right.down = false; right.ticks = 0 });

function processKeyInput(name) {
  if(eval(`${name}.down`)) {
    if(!eval(`${name}.last`)) {
      eval(`${name}.last = true`);
      return true;
    }
    let last = eval(`${name}.ticksLast`);
    if(eval(`${name}.ticks`) >= last) {
      eval(`${name}.ticks = 0`);
      switch(last) {
        case 50: eval(`${name}.ticksLast = 40`); break;
        case 40: eval(`${name}.ticksLast = 30`); break;
        case 30: eval(`${name}.ticksLast = 20`); break;
        case 20: eval(`${name}.ticksLast = 10`); break;
        case 10: eval(`${name}.ticksLast = 5`); break;
      }
      return true;
    } else eval(`${name}.ticks++`);
  } else eval(`${name}.ticksLast = 50;`);
  eval(`${name}.last = ${name}.down`);
  return false;
}

setTick(() => {
  if(processKeyInput('up')) navigateMenu('up');
  if(processKeyInput('down')) navigateMenu('down');
  if(processKeyInput('left')) navigateMenu('left');
  if(processKeyInput('right')) navigateMenu('right');
});

on('menu_manager:enter', () => { navigateMenu('enter'); } );
on('menu_manager:back', () => { navigateMenu('back'); } );

on('menu_manager:openMenu', openMenu);
on('menu_manager:closeMenu', closeMenu);
on('menu_manager:updateMenu', updateMenu);
on('menu_manager:navigateMenu', navigateMenu);
on('menu_manager:sendMessage', sendMessage);

RegisterNuiCallbackType('textinput');
on('__cfx_nui:textinput', (data, callback) => {
  if(data.prompt != undefined) AddTextEntry('menu_manager:textinput_entry', data.prompt);
  else AddTextEntry('menu_manager:textinput_entry', '');
  DisplayOnscreenKeyboard(false, 'menu_manager:textinput_entry', '', data.value != undefined?data.value:'', '', '', '', data.max != undefined?data.max:32);
  let inputTick = setTick(() => {
    HideHudAndRadarThisFrame();
    switch(UpdateOnscreenKeyboard()) {
      case 1:
        if(data.onchange != undefined && data.onchange != '') emit(data.onchange, GetOnscreenKeyboardResult());
        callback(GetOnscreenKeyboardResult());
      case -1:
      case 2:
      case 3:
        clearTick(inputTick);
    }
  });
});

let loader = setInterval(() => {
  if(exports.keybinder != undefined) {
    if(exports.keybinder.registerKeybind != undefined) {
      exports.keybinder.registerUpDownKeybind('menu_manager:navigation_up', 'menu_manager:up', '[Menu] Up', true, 'up');
      exports.keybinder.registerUpDownKeybind('menu_manager:navigation_down', 'menu_manager:down', '[Menu] Down', true, 'down');
      exports.keybinder.registerUpDownKeybind('menu_manager:navigation_left', 'menu_manager:left', '[Menu] Left', true, 'left');
      exports.keybinder.registerUpDownKeybind('menu_manager:navigation_right', 'menu_manager:right', '[Menu] Right', true, 'right');
      exports.keybinder.registerKeybind('menu_manager:navigation_enter', 'menu_manager:enter', '[Menu] Enter', true, 'return');
      exports.keybinder.registerKeybind('menu_manager:navigation_back', 'menu_manager:back', '[Menu] Back', true, 'back');

      setTimeout(() => {
        // openMenu('menu_manager:test', [
        //   { type: 'title', title: 'California', subtitle: 'Roleplay' },
        //   { type: 'text', name: 'menu_manager:testText', min: 0, max: 32, prompt: 'Test Text', onchange: 'menu_manager:test_text_change'},
        //   { type: 'number', name: 'menu_manager:testNumber', value: 16, min: 0, max: 32, step: 1, prompt: 'Test Number', onchange: 'menu_manager:test_number_change'},
        //   { type: 'scroll', name: 'menu_manager:testScroll', options: [
        //     {value: 'option1', text: 'Option 1'},
        //     {value: 'option2', text: 'Option 2'},
        //     {value: 'option3', text: 'Option 3'},
        //     {value: 'option4', text: 'Option 4'},
        //     {value: 'option5', text: 'Option 5'},
        //     {value: 'option6', text: 'Option 6'},
        //     {value: 'option7', text: 'Option 7'},
        //     {value: 'option8', text: 'Option 8'},
        //     {value: 'option9', text: 'Option 9'}
        //   ], value: 0, prompt: 'Test Scroll', onchange: 'menu_manager:test_scroll_change'},
        //   { type: 'custom', value: '<br style="height: 10vh">' },
        //   { type: 'button', name: 'menu_manager:buttonTest', value:'Test Button', onselect: 'menu_manager:test_button_change'}
        // ], 'menu_manager:back');
      }, 1000);

      clearInterval(loader);
    }
  }
}, 10);

exports('sendMessage', sendMessage);
exports('openMenu', openMenu);
exports('closeMenu', closeMenu);
exports('updateMenu', updateMenu);
exports('navigateMenu', navigateMenu);
exports('getActiveMenu', () => {
  return activeMenu;
});
