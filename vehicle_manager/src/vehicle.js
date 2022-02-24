let vehicleSettings = {};

let tempcar = {};
on('vehicle_manager:test_save', () => {
  let veh = isPedDrivingVehicle();
  if(veh) {
    tempcar = convertToJson(veh);
  }
});

on('vehicle_manager:test_spawn', () => {
  spawnFromJson(GetEntityCoords(PlayerPedId(), true), GetEntityHeading(PlayerPedId()), tempcar, (veh) => {
    SetPedIntoVehicle(PlayerPedId(), veh, -1);
  });
});

function convertToJson(veh) {
  let result = {};
  for(let key in vehicleSettings) {
    result[key] = vehicleSettings[key].get(veh);
  }
  return result;
}

function spawnFromJson(coords, heading = 0, vehJson, callback = undefined) {
  exports.helper.loadHashFromHash(vehJson.hash, (hash) => {
    if(!hash) {
      return;
    }
    if(IsModelAVehicle(hash)) {
      let veh = CreateVehicle(hash, ...coords, heading, true, true);
      let waiter = setTick(() => {
        if(DoesEntityExist(veh)) {
          SetVehicleModKit(veh, 0);
          for(let key in vehicleSettings) {
            vehicleSettings[key].set(veh, vehJson[key], vehJson);
          }
          if(callback != undefined) callback(veh);
          clearTick(waiter);
        }
      });
    }
  });
}

function createSetting(name, getValueFunction, setValueFunction) {
  if(getValueFunction != undefined && setValueFunction != undefined) {
    vehicleSettings[name] = {get: getValueFunction, set: setValueFunction};
  }
}

createSetting('hash', (veh) => { return GetEntityModel(veh); }, (veh, value) => {});
createSetting('engineHealth', (veh) => { return GetVehicleEngineHealth(veh); }, (veh, value) => { SetVehicleEngineHealth(veh, value) });
createSetting('fuel', (veh) => { return DecorExistOn(veh, c_fuel)?getFuel(veh):generateFuel(); }, (veh, value) => { setFuel(veh); });
createSetting('freeRefuel', (veh) => { return DecorExistOn(veh, c_freeRefuel)?DecorGetBool(veh, c_freeRefuel):false; }, (veh, value) => { DecorSetBool(veh, c_freeRefuel, value); });
createSetting('manual', (veh) => { return DecorExistOn(veh, c_manual)?DecorGetBool(veh, c_manual):false; }, (veh, value) => { DecorSetBool(veh, c_manual, value); });
//registerVehicleSetting('vin', (veh) => { return DecorExistOn(veh, c_manual)?DecorGetBool(veh, c_manual):false; }, (veh, value) => { DecorSetBool(veh, c_manual, value); });
createSetting('primary', (veh) => { GetVehicleCustomPrimaryColour(veh); }, (veh, value) => { SetVehicleCustomPrimaryColour(veh, ...value); });
createSetting('secondary', (veh) => { return GetVehicleCustomSecondaryColour(veh); }, (veh, value) => { SetVehicleCustomSecondaryColour(veh, ...value); });
createSetting('dashcolors', (veh) => { return GetVehicleDashboardColor(veh); }, (veh, value) => { SetVehicleDashboardColor(veh); });
createSetting('extracolors', (veh) => { return GetVehicleExtraColours(veh); }, (veh, value) => { SetVehicleExtraColours(veh, ...value); });
createSetting('interiorcolors', (veh) => { return GetVehicleInteriorColor(veh); }, (veh, value) => { SetVehicleInteriorColor(veh, value); });
createSetting('livery', (veh) => { return GetVehicleLivery(veh); }, (veh, value) => { SetVehicleLivery(veh, value); });
createSetting('customtires', (veh) => { return GetVehicleModVariation(veh, 23) || GetVehicleModVariation(veh, 24); }, (veh, value) => {  });
createSetting('mods',
(veh) => {
  let result = {};
  for(let i = 0; i < 60; i++) {
    switch(i) {
      case 18:
      case 22:
      case 20:
        result[i] = IsToggleModOn(veh, i);
        break;
      default:
        result[i] = GetVehicleMod(veh, i);
        break;
    }
  }
  return result;
},
(veh, value, json) => {
  for(let key in value) {
    key = parseInt(key + '');
    switch(key) {
      case 18:
      case 22:
      case 20:
        ToggleVehicleMod(veh, key, value[key]);
        break;
      default:
        SetVehicleMod(veh, key, value[key], json.customtires);
        break;
    }
  }
});
createSetting('extras',
(veh) => {
  let result = {};
  for(let i = 0; i < 14; i++) {
    result[i] = IsVehicleExtraTurnedOn(veh, i)
  }
  return result;
},
(veh, value) => {
  for(let key in value) {
    SetVehicleExtra(veh, parseInt(key + ''), 1-(1*value[key]));
  }
});
createSetting('modcolors1', (veh) => { return GetVehicleModColor_1(veh); }, (veh, value) => { SetVehicleModColor_1(veh, ...value); });
createSetting('modcolors2', (veh) => { return GetVehicleModColor_2(veh); }, (veh, value) => { SetVehicleModColor_2(veh, ...value); });
createSetting('neon', (veh) => { return [IsVehicleNeonLightEnabled(veh, 0), IsVehicleNeonLightEnabled(veh, 1), IsVehicleNeonLightEnabled(veh, 2), IsVehicleNeonLightEnabled(veh, 3)]; }, (veh, value) => { for(let i in value) SetVehicleNeonLightEnabled(veh, i, value[i]); });
createSetting('neoncolors', (veh) => { return GetVehicleNeonLightsColour(veh); }, (veh, value) => { SetVehicleNeonLightsColour(veh, ...value) });
createSetting('plate', (veh) => { return GetVehicleNumberPlateText(veh); }, (veh, value) => { SetVehicleNumberPlateText(veh, value); });
createSetting('plateindex', (veh) => { return GetVehicleNumberPlateTextIndex(veh); }, (veh, value) => { SetVehicleNumberPlateTextIndex(veh, value) });
createSetting('rooflivery', (veh) => { return GetVehicleRoofLivery(veh); }, (veh, value) => { SetVehicleRoofLivery(veh, value) });
createSetting('tiresmokecolor', (veh) => { return GetVehicleTyreSmokeColor(veh); }, (veh, value) => { SetVehicleTyreSmokeColor(veh, ...value) });
createSetting('wheeltype', (veh) => { return GetVehicleWheelType(veh); }, (veh, value) => { SetVehicleWheelType(veh, value) });
createSetting('tint', (veh) => { return GetVehicleWindowTint(veh); }, (veh, value) => { SetVehicleWindowTint(veh, value) });
createSetting('xenoncolors', (veh) => { return GetVehicleXenonLightsColor(veh); }, (veh, value) => { SetVehicleHeadlightsColour(veh, value) });
