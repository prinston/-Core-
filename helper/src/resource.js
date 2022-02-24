let onStart = {};
let onStop = {};

on('onClientResourceStart', (resource) => {
  resource = resource.toLowerCase();
  if(onStart[resource] != undefined) {
    for(let eventIndex in onStart[resource]) {
      emit(onStart[resource][eventIndex], resource);
    }
  }
});

on('onClientResourceStop', (resource) => {
  resource = resource.toLowerCase();
  if(onStop[resource] != undefined) {
    for(let eventIndex in onStop[resource]) {
      emit(onStop[resource][eventIndex], resource);
    }
  }
});

function whenResourceStarts(resource, event) {
  resource = resource.toLowerCase();
  if(onStart[resource] == undefined) onStart[resource] = [event];
  else if(!onStart[resource].includes(event)) onStart[resource].push(event);
}

function whenResourceStops(resource, event) {
  resource = resource.toLowerCase();
  if(onStop[resource] == undefined) onStop[resource] = [event];
  else if(!onStop[resource].includes(event)) onStop[resource].push(event);
}

exports('whenResourceStarts', whenResourceStarts);
exports('whenResourceStops', whenResourceStops);
on('helper:whenResourceStarts', whenResourceStarts);
on('helper:whenResourceStops', whenResourceStops);
