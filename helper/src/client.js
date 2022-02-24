function drawText(text, x = 0, y = 0, rgba = [255, 255, 255, 255]) {
  SetTextFont(0);
  SetTextProportional(1);
  SetTextScale(0.0, 0.3);
  SetTextDropshadow(0, 0, 0, 0, 255);
  SetTextEdge(1, 0, 0, 0, 255);
  SetTextDropShadow();
  SetTextOutline();
  SetTextColour(...rgba);
  SetTextEntry("STRING");
  AddTextComponentString(text);
  DrawText(x/100, y/100);
}
exports('drawText', drawText);
onNet('drawText', drawText);

function loadHash(model, callback) {
  let hash = GetHashKey(model);
  if(IsModelInCdimage(hash)) {
    RequestModel(hash);
    let waiter = setInterval(() => {
      if(HasModelLoaded(hash)) {
        callback(hash);
        clearInterval(waiter);
      }
    }, 1);
  }
}
exports('loadHash', loadHash);
onNet('loadHash', (model, callback) => {
  loadHash(model, () => {
    if(callback != undefined) emit(callback);
  })
});

function loadHashFromHash(hash, callback) {
  if(IsModelInCdimage(hash)) {
    RequestModel(hash);
    let waiter = setInterval(() => {
      if(HasModelLoaded(hash)) {
        callback(hash);
        clearInterval(waiter);
      }
    }, 1);
  } else if(callback != undefined) callback(false);
}
exports('loadHashFromHash', loadHashFromHash);
onNet('loadHashFromHash', (hash, callback) => {
  loadHashFromHash(hash, () => {
    if(callback != undefined) emit(callback);
  })
});

RegisterCommand('createblip', (source, args, raw) => {

});
