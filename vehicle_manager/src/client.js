exports.keybinder.registerKeybind('vehicle_manager:gear_up', 'vehicle_manager:gear_up', '[Manual] Gear Up', true, 'UP');
exports.keybinder.registerKeybind('vehicle_manager:gear_down', 'vehicle_manager:gear_down', '[Manual] Gear Down', true, 'DOWN');

exports.keybinder.registerKeybind('vehicle_manager:test_save', 'vehicle_manager:test_save', 'Test Vehicle: Save', true, '4');
exports.keybinder.registerKeybind('vehicle_manager:test_spawn', 'vehicle_manager:test_spawn', 'Test Vehicle: Spawn', true, '5');

const c_fuel = 'FUEL_LEVEL';
const c_freeRefuel = 'FUEL_REFILL_FREE';
const c_manual = 'GEAR_MANUAL';
const c_vin = 'VIN_NUMBER';

setTimeout(() => {
  DecorRegister(c_fuel, 1);
  DecorRegister(c_freeRefuel, 2);
  DecorRegister(c_manual, 2);
  DecorRegister(c_vin, 3);
}, 1);

function disableUD() {
  DisableControlAction(0, 60, true);
  DisableControlAction(0, 61, true);
  DisableControlAction(0, 62, true);
}

function disableLR() {
  DisableControlAction(0, 59, true);
  DisableControlAction(0, 63, true);
  DisableControlAction(0, 64, true);
}

function isPedDrivingVehicle() {
  let ped = PlayerPedId();
  SetPedHelmet(ped, false);
  if(IsPedInAnyVehicle(ped)) {
    let veh = GetVehiclePedIsIn(ped, false);
    if(GetPedInVehicleSeat(veh, -1) == ped) {
      return veh;
    }
  }
  return false;
}

let drawX = 0;
let drawY = 0;
function drawText(text) {
  SetTextFont(0);
  SetTextProportional(1);
  SetTextScale(0.0, 0.3);
  SetTextDropshadow(0, 0, 0, 0, 255);
  SetTextEdge(1, 0, 0, 0, 255);
  SetTextDropShadow();
  SetTextOutline();
  SetTextColour(255, 255, 255, 255);
  SetTextEntry("STRING");
  AddTextComponentString(text);
  DrawText(0.005 + (0.15 * drawX), 0.5 + (0.0175 * (drawY)));
  drawY++;
}

let currentIndex = 0;
let currentVehicle = -1;

function getClassString(hash) {
  switch(GetVehicleClassFromName(hash)) {
    case 0: return 'Compacts';
    case 1: return 'Sedans';
    case 2: return 'SUVs';
    case 3: return 'Coupes';
    case 4: return 'Muscle';
    case 5: return 'Sports Classics';
    case 6: return 'Sports';
    case 7: return 'Super';
    case 8: return 'Motorcycles';
    case 9: return 'Off-road';
    case 10: return 'Industrial';
    case 11: return 'Utility';
    case 12: return 'Vans';
    case 13: return 'Cycles';
    case 14: return 'Boats';
    case 15: return 'Helicopters';
    case 16: return 'Planes';
    case 17: return 'Service';
    case 18: return 'Emergency';
    case 19: return 'Military';
    case 20: return 'Commercial';
    case 21: return 'Trains';
    case 22: return 'Openwheel';
  }
}

setTick(() => {
  drawX = 0;
  drawY = 0;
  SetPedHelmet(PlayerPedId(), false);
  let prevVehicle = currentVehicle;
  currentVehicle = isPedDrivingVehicle();

  if(currentVehicle) {
    lastVehPedWasIn = currentVehicle;
    tryRandomTireBurst(currentVehicle);
    useFuel(currentVehicle);
    checkIfFailed(currentVehicle);
    manualCheck(currentVehicle);

    let model = GetEntityModel(currentVehicle);

    let boat = IsThisModelABoat(model) || IsThisModelAJetski(model);
    let plane = IsThisModelAHeli(model) || IsThisModelAPlane(model);
    let bike = IsThisModelABike(model) || IsThisModelABicycle(model) || IsThisModelAQuadbike(model);
    if(!plane) {
      if(IsEntityUpsidedown(currentVehicle)) {
        disableLR();
        if(!bike) disableUD();
      }
      if(IsEntityInAir(currentVehicle) && !IsThisModelABicycle(model)) {
        disableLR();
        if(!bike && !boat) {
          disableUD();
        }
      }
    }
  }
  if(prevVehicle != currentVehicle && DoesEntityExist(prevVehicle)) {
    emit('vehicle_manager:exit', prevVehicle);
    prevVehicle = -1;
  }
});
