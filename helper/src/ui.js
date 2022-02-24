let interactLocations = {};
let blips = {};

// {
//   x: 0,
//   y: 0,
//   z: 0,
//   name: '',
//   color: 0,
//   sprite: 0,
// }
function createBlip(name, options) {
  let blip;
  if(blips[name] != undefined) blip = blips[name];
  else blip = AddBlipForCoord(options.x, options.y, options.z);
  SetBlipSprite(blip, options.sprite);
  SetBlipColour(blip, options.color);
  SetBlipAsShortRange(blip, true);
  AddTextEntry('BLIP' + blip, options.name);
  BeginTextCommandSetBlipName('BLIP' + blip);
  AddTextComponentSubstringPlayerName('');
  EndTextCommandSetBlipName(blip);
  blips[name] = blip;
  return blip;
}
exports('createBlip', createBlip);
on('helper:createBlip', createBlip);

// {
//   name: '',
//   radius: 1,
//   event: '',
//   coords: [0, 0, 0],
//   blip: {
//     use: false,
//     sprite: 0,
//     color: 0
//   },
//   marker: {
//     type: 0,
//     color: [0,0,0,0]
//   }
// }
function createInteractionLocation(name, options = {blip: { use: false }}) {
  if(options.marker != undefined) {
    if(options.marker.type != undefined && options.marker.color != undefined && options.marker.color.length >= 3) {
      if(options.radius != undefined && options.coords != undefined && options.coords.length == 3) {
        interactLocations[name] = options;
        if(options.blip != undefined && options.blip.use) {
          createBlip(name, { x: options.coords[0], y: options.coords[1], z: options.coords[2], name: options.name, sprite: options.blip.sprite, color: options.blip.color });
        }
      }
    }
  }
}
exports('createInteractionLocation', createInteractionLocation);
on('helper:createInteractionLocation', createInteractionLocation);

function distance(start, end) {
  return Math.abs(Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2) + Math.pow(end[2] - start[2], 2)));
}

function distanceFromPlayer(start) {
  let pc = GetEntityCoords(PlayerPedId());
  return distance(pc, start);
}

let alphaInterpolation = 0.0;
let alphaInterpolationAdd = true;

let inRadius = [];

setTick(() => {
  let newRadius = [];

  alphaInterpolation += (alphaInterpolationAdd?1:-1) * 0.001;
  if(alphaInterpolationAdd && alphaInterpolation >= 1) {
    alphaInterpolationAdd = false;
    alphaInterpolation = 1;
  }
  if(!alphaInterpolationAdd && alphaInterpolation <= 0) {
    alphaInterpolationAdd = true;
    alphaInterpolation = 0;
  }

  for(let index in interactLocations) {
    let location = interactLocations[index];
    let distance = distanceFromPlayer(location.coords);
    if(distance <= 2*location.radius) {
      if(distance <= location.radius) {
        drawText('IN RANGE: ' + location.event);
        newRadius.push(location.event);
      }
      drawText(distance, 2, 2);
      let alpha = 1.0-((distance-location.radius)/location.radius);
      drawText(alpha, 2, 3.25);
      if(alpha < 0) alpha = 0;
      if(alpha > 1) alpha = 1;
      alpha -= (alphaInterpolation/10);
      if(alpha < 0) alpha = 0;
      drawText(alpha, 2, 4.5);
      alpha *= 255;
      drawText(alpha, 2, 5.75);
      alpha = parseInt(alpha);
      drawText(alpha, 2, 7);
      DrawMarker(
        location.marker.type,
        location.coords[0], location.coords[1], location.coords[2] - 1,
        0,0,0, //direction
        0,0,0, //rotation
        location.radius*2, location.radius*2, location.radius*2, //scale
        location.marker.color[0], location.marker.color[1], location.marker.color[2], alpha, //rgba
        false, false, 2, false, null, null, false);
    }
  }

  for(let eventIndex in inRadius) {
    if(!newRadius.includes(inRadius[eventIndex])) {
      emit(inRadius[eventIndex], false);
    }
  }
  for(let eventIndex in newRadius) {
    if(!inRadius.includes(newRadius[eventIndex])) {
      emit(newRadius[eventIndex], true);
    }
  }
  inRadius = newRadius;

  let drawY = 5;
  for(let i in inRadius) {
    drawText('In Range [' + i + ']: ' + inRadius[i], 10, drawY);
    drawY += 0.5;
  }
});
