function generateFuel() {
  return parseInt(Math.random() * 76) + 25;
}

function setFuel(veh, amount) {
  if(typeof amount == 'number' && amount >= 0 && amount <= 100) {
    SetVehicleFuelLevel(veh, amount * 1.0);
    DecorSetFloat(veh, c_fuel, GetVehicleFuelLevel(veh));
  }
}

function addFuel(veh, amount) {
  let newAmount = getFuel(veh) + amount;
  if(newAmount > 100) newAmount = 100;
  if(newAmount < 0) newAmount = 0;
  setFuel(veh, newAmount);
}

function getFuel(veh) {
  return DecorGetFloat(veh, c_fuel);
}

function useFuel(veh) {
  if(!DecorExistOn(veh, c_fuel)) {
    setFuel(veh, generateFuel());
  }
  if(IsVehicleEngineOn(veh)) {
    let subtract = config.rpm[GetVehicleCurrentRpm(veh).toFixed(1)] * config.class[GetVehicleClass(veh)];
    addFuel(veh, (-1 * (config.consumption * subtract)) * 0.05);
  }
}
