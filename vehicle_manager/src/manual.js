let gears = {
  current: 0,
  max: -1
}

let gearMulti = 1;

on('vehicle_manager:gear_up', () => {
  let veh = isPedDrivingVehicle();
  if(veh) {
    if(DecorExistOn(veh, c_manual)) {
      gears.current++;
      if(gears.current > gears.max) gears.current = gears.max;
    }
  }
});

on('vehicle_manager:gear_down', () => {
  let veh = isPedDrivingVehicle();
  if(veh) {
    if(DecorExistOn(veh, c_manual)) {
      gears.current--;
      if(gears.current < -1) gears.current = -1;
    }
  }
});

on('vehicle_manager:exit', (veh) => {
  gears.current = 1;
  gears.max = -1;
})

function manualCheck(veh) {
  if(DecorExistOn(veh, c_manual) && DecorGetBool(veh, c_manual)) {
    gears.max = GetVehicleHighGear(veh);

    let next = GetVehicleNextGear(veh);

    gears.speed = 0;
    if(gears.current != next) {
      gears.speed = GetEntitySpeed(veh);
      gearMulti = 0.15;
      SetVehicleCurrentRpm(veh, GetControlNormal(2, 71));
    } else gearMulti = 1;
    if(gears.current == -1) { // Reverse
      gearMulti = 0.5;
      DisableControlAction(2, 71, true);
      if(IsDisabledControlPressed(2, 71)) {
        SetControlNormal(2, 72, GetDisabledControlNormal(2, 71) * 0.98);
        SetVehicleCurrentRpm(veh, GetDisabledControlUnboundNormal(2, 72));
      } else {
        if(IsDisabledControlPressed(2, 72)) {
          SetVehicleBrake(veh, true);
          SetVehicleBrakeLights(veh, true);
        }
        DisableControlAction(2, 72, true);
      }
    } else {
      DisableControlAction(2, 72, true);
      if(IsDisabledControlPressed(2, 72)) {
        SetVehicleBrake(veh, true);
        SetVehicleBrake(veh, true);
        SetVehicleBrakeLights(veh, true);
      }
      if(gears.current == 0) {
        gearMulti = 0;
        if(GetControlValue(2, 71) > 127) SetVehicleCurrentRpm(veh, (GetControlValue(2, 71)-127)/127);
        else SetVehicleCurrentRpm(veh, 0);
      }
    }
    SetVehicleMaxSpeed(veh, gears.speed);
  }
}
