let openMenus = [];
let activeMenu = '';

function sendEvent(eventName, data) {
  fetch(`https://${GetParentResourceName()}/` + eventName, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data)
  }).then(resp => { resp.json() }).then(resp => {});
}

const scrollMod = 5;

let currentScroll = 0;
let wantedScroll = 0;

setInterval(() => {
  try {
    if(activeMenu == undefined && activeMenu == '') return;
    let menu = $($(`div[name='${activeMenu}']`).get(0));
    if(Math.abs(currentScroll-wantedScroll) < scrollMod) currentScroll = wantedScroll;
    if(currentScroll < wantedScroll) currentScroll += scrollMod;
    if(currentScroll > wantedScroll) currentScroll -= scrollMod;
    if(menu != undefined) {
      if(menu.get(0) != undefined) {
        menu.get(0).scroll({
          top: currentScroll,
          left: 0
        });
      }
    }
  } catch(e) {}
}, 0);

function scrollTop(input) {
  try {
    let option = $(input);
    let parent = $(option.parent());
    wantedScroll = option.position().top + (option.outerHeight()/2) - (parent.outerHeight()/2) + parent.scrollTop();
  } catch(e) {}
}

function hasAttr(element, attribute) {
  let attr = element.attr(attribute);
  return typeof attr !== 'undefined';
}

function processInput(input, isShift, isControl) {
  try {
    let options = $(`div[name='${activeMenu}']>div.option`);
    let option = $($(`div[name='${activeMenu}']>div.option.selected`).get(0));
    switch(input.toLowerCase()) {
      case 'up':
        let prev = $(options.get(0));
        if(prev.hasClass('selected')) {
          prev.removeClass('selected');
          $(options.get(options.size() - 1)).addClass('selected');
        } else {
          if(options.size() > 1) {
            options.each((index) => {
              if(index != 0) {
                let option = $(options.get(index));
                if(option.hasClass('selected')) {
                  prev.addClass('selected');
                  option.removeClass('selected');
                } else {
                  prev = option;
                }
              }
            });
          }
        }
        break;
      case 'down':
        let finished = false;
        options.each((index) => {
          if(!finished) {
            let option = $(options.get(index));
            if(options.size() > 1) {
              if(option.hasClass('selected')) {
                let finalIndex = index + 1;
                if(finalIndex >= options.size()) finalIndex = 0;
                $(options.get(finalIndex)).addClass('selected');
                option.removeClass('selected');
                finished = true;
              }
            }
          }
        });
        break;
      case 'left':
      case 'right':
        switch(option.attr('type').toLowerCase()) {
          case 'number':
            let val = parseFloat(option.attr('value'));
            let mod = 1;
            if(hasAttr(option, 'step')) mod = parseFloat(option.attr('step'));
            mod *= (input.toLowerCase()=='left'?-1:1);
            if(isShift) mod *= 10;
            else if(isControl) mod *= 5;
            val += mod;
            if(hasAttr(option, 'min')) {
              let min = parseFloat(option.attr('min'));
              if(val < min) val = min;
            }
            if(hasAttr(option, 'max')) {
              let max = parseFloat(option.attr('max'));
              if(val > max) val = max;
            }
            if(parseInt(val) == val) val = parseInt(val);
            option.attr('value', val);
            $($(option.children().get(0)).children().get(1)).text(val);
            if(option.attr('onchange') != undefined) {
              sendEvent('emit', {
                event: option.attr('onchange'),
                data: [val]
              });
            }
            break;
          case 'scroll':
            let scrolls = $(`div[name='${activeMenu}']>div.option.selected>div>div`);
            let active = $(`div[name='${activeMenu}']>div.option.selected>div>div.active`);
            let index = option.attr('value');
            if(input.toLowerCase()=='left') index--;
            else index++;
            if(index < 0) index += scrolls.size();
            if(index >= scrolls.size()) index -= scrolls.size();
            option.attr('value', index);
            active.removeClass('active');
            $(scrolls.get(index)).addClass('active');
            if(option.attr('onchange') != undefined) {
              sendEvent('emit', {
                event: option.attr('onchange'),
                data: [index, $(scrolls.get(index)).attr('value'), $(scrolls.get(index)).text()]
              });
            }
            break;
        }
        break;
      case 'enter':
        switch(option.attr('type').toLowerCase()) {
          case 'text':
            let optionValue = $($(`div[name='${activeMenu}']>div.option.selected>div>p`).get(0));
            fetch(`https://${GetParentResourceName()}/textinput`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                  max: (option.attr('max')?parseInt(option.attr('max')):64),
                  value: option.attr('value'),
                  prompt: $(option.children().get(1)).text(),
                  onchange: option.attr('onchange')
                })
            }).then(resp => resp.json()).then(resp => {
              option.attr('value', resp)
              optionValue.text(resp);
            });
            break;
          default:
            if(option.attr('onselect') != undefined && option.attr('onselect').length > 0) {
              sendEvent('emit', {
                event: option.attr('onselect'),
                data: []
              });
            }
            break;
        }
        break;
      case 'back':
        let menu = $($(`div[name='${activeMenu}']`).get(0));
        if(menu.attr('back') == undefined || menu.attr('back') == '' || menu.attr('back') == 'undefined') {
          closeMenu(activeMenu);
        } else {
          if(menu.attr('back').toLowerCase() != 'none') {
            sendEvent('emit', {
              event: menu.attr('back'),
              data: [activeMenu]
            });
          }
        }
        break;
    }
    scrollTop($(`div[name='${activeMenu}']>div.option.selected`).get(0));
  } catch(e) {}
}

function createOption(settings) {
  let option = $('<div>');
  option.attr('class', 'option');
  option.attr('type', settings.type.toLowerCase());
  if(settings.name != undefined) option.attr('name', settings.name);
  if(settings.onselect != undefined) option.attr('onselect', settings.onselect);
  if(settings.onchange != undefined) option.attr('onchange', settings.onchange);
  switch(settings.type.toLowerCase()) {
    case 'custom':
      option = $(settings.value)
      break;
    case 'title':
      option.attr('class', 'title');
      for(let key in settings) {
        option.attr(key, settings[key]);
      }
      option.append($('<p>').text(settings.title));
      if(settings.subtitle != undefined) option.append($('<p>').text(settings.subtitle));
      break;
    case 'text':
      let textDiv = $('<div>');
      let p = $('<p>');
      let prompt = $('<p>');
      prompt.attr('class', 'subtitle');
      if(settings.value != undefined) {
        option.attr('value', settings.value);
        p.text(settings.value);
      }
      if(settings.max != undefined) option.attr('max', settings.max);
      if(settings.prompt != undefined) {
        option.attr('prompt', settings.prompt);
        prompt.text(settings.prompt);
      } else {
        option.attr('prompt', '');
      }
      textDiv.append(p);
      option.append(textDiv);
      option.append(prompt);
      break;
    case 'number':
      let numberDiv = $('<div>');
      if(settings.max != undefined) option.attr('max', settings.max);
      if(settings.min != undefined) option.attr('min', settings.min);
      if(settings.step != undefined) option.attr('step', settings.step);
      option.attr('value', settings.value?settings.value:0);
      numberDiv.append($('<svg viewBox="0 0 100 100"><path d="M 10 40 H 90 V 60 H 10 V 40" fill="white"/></svg>'));
      numberDiv.append($('<p>').text(settings.value?settings.value:0));
      numberDiv.append($('<svg viewBox="0 0 100 100"><path d="M 10 40 H 40 V 10 H 60 V 40 H 90 V 60 H 60 V 90 H 40 V 60 H 10 V 40" fill="white"/></svg>'));
      option.append(numberDiv);
      if(settings.prompt != undefined) {
        option.append($('<p class="subtitle">').text(settings.prompt));
      }
      break;
    case 'scroll':
      let scrollDiv = $('<div>');
      option.attr('value', settings.value?settings.value:0);
      scrollDiv.append($('<svg viewBox="0 0 100 100"><path d="M 10 50 L 90 10 L 90 90 L 10 50" fill="white"/></svg>'));
      for(let index in settings.options) {
        let selectable = $('<div>');
        for(let attr in settings.options[index]) {
          selectable.attr(attr, settings.options[index][attr]);
        }
        selectable.text(settings.options[index].text?settings.options[index].text:settings.options[index].value);
        if(index == settings.value) selectable.attr('class', 'active');
        scrollDiv.append(selectable);
      }
      scrollDiv.append($('<svg viewBox="0 0 100 100"><path d="M 90 50 L 10 10 L 10 90 L 90 50" fill="white"/></svg>'));
      option.append(scrollDiv);
      if(settings.prompt != undefined) {
        option.append($('<p class="subtitle">').text(settings.prompt));
      }
      break;
    case 'button':
      let buttonDiv = $('<div>');
      buttonDiv.append($('<p>').text(settings.value));
      option.append(buttonDiv);
      break;
    case 'textdisplay':
      let textDisplayDiv = $('<div>');
      let p1 = $('<p>');
      let prompt1 = $('<p>');
      prompt1.attr('class', 'subtitle');
      if(settings.value != undefined) {
        option.attr('value', settings.value);
        p1.text(settings.value);
      }
      if(settings.prompt != undefined) {
        option.attr('prompt', settings.prompt);
        prompt1.text(settings.prompt);
      } else {
        option.attr('prompt', '');
      }
      textDisplayDiv.append(p1);
      option.append(textDisplayDiv);
      option.append(prompt1);
      break;
  }
  return option;
}

function closeMenu(menuName) {
  let menu = $(`div.menu[name='${menuName}']`);
  if(openMenus.includes(menuName.toLowerCase())) {
    while(openMenus.includes[menuName.toLowerCase()]) openMenus.splice(openMenus.indexOf(menuName.toLowerCase()), 1);
  }
  if(activeMenu == menuName) {
    currentScroll = 0;
    wantedScroll = 0;
    if(openMenus.length > 0) {
      activeMenu = openMenus[0];
    } else {
      activeMenu = '';
    }
  }
  menu.remove();
}

window.addEventListener('message', (event) => {
  switch(event.data.type.toLowerCase()){
    case 'input':
      if(openMenus.length > 0) {
        processInput(event.data.direction, event.data.isShift, event.data.isControl);
        switch(event.data.direction.toLowerCase()) {
          case 'up':
          case 'down':
          case 'left':
          case 'right':
            sendEvent('playsound', { type: 'nav' });
            break;
          case 'enter':
            sendEvent('playsound', { type: 'enter' });
            break;
          case 'back':
            sendEvent('playsound', { type: 'back' });
            break;
        }
      }
      break; // end input
    case 'open':
      currentScroll = 0;
      wantedScroll = 0;
      while(openMenus.includes(event.data.name)) closeMenu(event.data.name);
      openMenus.push(event.data.name.toLowerCase());
      activeMenu = event.data.name;
      let menu = $('<div>');
      menu.attr('name', event.data.name).attr('class', 'menu');
      let hasSetFirst = false;
      for(let index in event.data.options) {
        let option = createOption(event.data.options[index]);
        if(!hasSetFirst && option.attr('class') == 'option') {
          option.addClass('selected');
          hasSetFirst = true;
        }
        menu.append(option);
      }
      if(event.data.back != undefined) menu.attr('back', event.data.back);
      $($('body').get(0)).append(menu);
      break;
    case 'close':
      closeMenu(event.data.name);
      break;
    case 'update':
      if(openMenus.includes(event.data.name.toLowerCase())) {
        let update = $(`div.menu[name='${event.data.name}']>div.option[name='${event.data.option}']`);
        if(update != undefined) update.attr(event.data.attribute, event.data.value);
      }
      break;
  }

  let options = $(`div[name='${activeMenu}']>div.option`);
  options.each((index) => {
    let option = $(options.get(index));
    if(option.attr('type') != undefined) {
      switch(option.attr('type').toLowerCase()) {
        case 'button':
          $($(option.children().get(0)).children().get(0)).text(option.attr('value'));
          break;
        case 'number':
          let numVal = parseFloat(option.attr('value'));
          if(hasAttr(option, 'max')) {
            if(numVal > parseFloat(option.attr('max'))) {
              numVal = parseFloat(option.attr('max'));
              if(option.attr('onchange') != undefined) {
                sendEvent('emit', {
                  event: option.attr('onchange'),
                  data: [numVal]
                });
              }
            }
          }
          if(hasAttr(option, 'min')) {
            if(numVal < parseFloat(option.attr('min'))) {
              numVal = parseFloat(option.attr('min'));
              if(option.attr('onchange') != undefined) {
                sendEvent('emit', {
                  event: option.attr('onchange'),
                  data: [numVal]
                });
              }
            }
          }
          if((numVal * 1.0) == parseInt(numVal + '')) numVal = parseInt(numVal);
          option.attr('value', numVal);
          $($(option.children().get(0)).children().get(1)).text(numVal);
          break;
        case 'text':
          $($(option.children().get(0)).children().get(0)).text(option.attr('value'));
          break;
        case 'textdisplay':
          $($(option.children().get(0)).children().get(0)).text(option.attr('value'));
          break;
      }
    }
  });

  let menus = $('div.menu');
  menus.each((i) => {
    let menu = $(menus.get(i));
    if(menu.attr('name') != activeMenu) menu.attr('style', 'display: none');
    else menu.attr('style', 'display: block');
  });

  sendEvent('activeMenu', { menu: activeMenu });
});
