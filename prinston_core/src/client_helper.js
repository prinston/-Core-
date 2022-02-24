function drawText(x, y, text) {
  SetTextFont(0);
  SetTextProportional(1);
  SetTextScale(0.0, 0.3);
  SetTextDropshadow(0, 0, 0, 0, 255);
  SetTextEdge(1, 0, 0, 0, 255);
  SetTextDropShadow();
  SetTextOutline();
  SetTextColour(128, 128, 128, 255);
  SetTextEntry("STRING");
  AddTextComponentString(text);
  DrawText(0.005 + (0.01 * x), 0.015 + (0.1 * y));
}

on('prinston_core:drawText', (x, y, text) => {
  drawText(x, y, text);
});

function loadHash(model, callback) {
  let hash = GetHashKey(model);
  if(IsModelInCdimage(hash) && IsModelAPed(hash)) {
    RequestModel(hash);
    let waiter = setInterval(() => {
      if(HasModelLoaded(hash)) {
        callback(hash);
        clearInterval(waiter);
      }
    }, 1);
  }
}

function IsAnyControlEnabled(keyset) {
  for(let i in keyset) if(IsControlEnabled(2, keyset[i])) return true;
  return false;
}

function IsAnyControlDisabled(keyset) {
  for(let i in keyset) if(!IsControlEnabled(2, keyset[i])) return true;
  return false;
}

function IsAnyControlPressed(keyset) {
  for(let i in keyset) if(IsControlPressed(2, keyset[i])) return true;
  return false;
}

function IsAnyControlJustPressed(keyset) {
  for(let i in keyset) if(IsControlJustPressed(2, keyset[i])) return true;
  return false;
}

function IsAnyDisabledControlPressed(keyset) {
  for(let i in keyset) if(IsDisabledControlPressed(2, keyset[i])) return true;
  return false;
}

function IsAnyDisabledControlJustPressed(keyset) {
  for(let i in keyset) if(IsDisabledControlJustPressed(2, keyset[i])) return true;
  return false;
}

function IsAnyControlReleased(keyset) {
  for(let i in keyset) if(IsControlReleased(2, keyset[i])) return true;
  return false;
}

function IsAnyControlJustReleased(keyset) {
  for(let i in keyset) if(IsControlJustReleased(2, keyset[i])) return true;
  return false;
}

function IsAnyDisabledControlReleased(keyset) {
  for(let i in keyset) if(IsDisabledControlReleased(2, keyset[i])) return true;
  return false;
}

function IsAnyDisabledControlJustReleased(keyset) {
  for(let i in keyset) if(IsDisabledControlJustReleased(2, keyset[i])) return true;
  return false;
}

function createNotification(data) {
  if(data != undefined) {
    console.log(data);
    SendNuiMessage(JSON.stringify({
      type: 'notification',
      icon: data.icon,
      title: data.title,
      subtitle: data.subtitle,
      time: data.fadeTime
    }));
  }
}

exports('createNotification', createNotification);
onNet('prinston_core:createNotification', createNotification);
