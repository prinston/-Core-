function sendMessage(json) {
  SendNuiMessage(JSON.stringify(json));
}

let maxHeight = 0;
let maxWidth = 0;

RegisterNuiCallbackType('getmax');
on('__cfx_nui:getmax', (data, callback) => {
  maxHeight = data.height;
  maxWidth = data.width;
  console.log(maxHeight, maxWidth);
  callback({});
});

function getMaxWidth() {
  return maxWidth;
}

function getMaxHeight() {
  return maxHeight;
}

function inject(html) {
  while(html.includes('\n      ')) html = html.replace('\n      ', '');
  sendMessage({
    type: 'inject',
    source: html
  })
}

function run(js) {
  while(js.includes('\n      ')) js = js.replace('\n      ', '');
  sendMessage({
    type: 'run',
    source: js
  })
}

exports('getMaxWidth', getMaxWidth);
exports('getMaxHeight', getMaxHeight);
exports('run', run);
exports('inject', inject);

on('ui_manager:getMaxWidth', (callback) => {
  if(callback != undefined) emit(callback, maxWidth);
});
on('ui_manager:getMaxHeight', (callback) => {
  if(callback != undefined) emit(callback, maxHeight);
});
on('ui_manager:inject', (html) => {
  inject(html);
});
on('ui_manager:run', (js) => {
  run(js);
});
