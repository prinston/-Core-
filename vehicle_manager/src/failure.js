let prevVeh;
let vehClass;

let damageMultiplier = 0.0;
let weaponMultiplier = 0.0;
let engineDamageMultiplier = 0.0;
let brakeForce = 1.0;
let brakingF = false;
let brakingB = false;

let health = {
  engine: {
    last: 1000,
    current: 1000,
    new: 1000,
    delta: 0.0,
    scaled: 0.0
  },
  body: {
    last: 1000,
    current: 1000,
    new: 1000,
    delta: 0.0,
    scaled: 0.0
  },
  petrol: {
    last: 1000,
    current: 1000,
    new: 1000,
    delta: 0.0,
    scaled: 0.0
  },
}

function scale(input, min, max, begin, end, curve) {
  if(min > max) return 0;
  let orange = max - min
  let nrange = end>begin?end-begin:begin-end;
  let normalized = 0.0;

  if(curve > 10) curve = 10;
  if(curve < -10) curve = -10;
  curve = (curve * 0.1 * -1);
  curve = Math.pow(10, curve);

  if(input < min) input = min;
  if(input > max) input = max;

  normalized = (input - min) / orange;

  if(end > begin) return (Math.pow(normalized, curve) * nrange) + begin;
  else return begin - (Math.pow(normalized, curve) * nrange);
}

function updateVehicleHealthData(veh, cfg, type) {
  eval(`health.${cfg}.current = GetVehicle${type}Health(veh);`);
  eval(`if(health.${cfg}.current == 1000) health.${cfg}.last = 1000;`);
  eval(`health.${cfg}.new = health.${cfg}.current;`);
  eval(`health.${cfg}.delta = health.${cfg}.last - health.${cfg}.current;`);
  eval(`health.${cfg}.scaled = health.${cfg}.delta * config.failure.damageMultiplier * config.failure.class[vehClass];`);
}


on('vehicle_manager:exit', (veh) => {
  gearMulti = 1.0;
  if(prevVeh == -1) return;
  if(DoesEntityExist(prevVeh)) {
    SetVehicleHandlingFloat(prevVeh, 'CHandlingData', 'fBrakeForce', brakeForce);
    SetVehicleHandlingFloat(prevVeh, 'CHandlingData', 'fWeaponDamageMult', weaponMultiplier);
    SetVehicleHandlingFloat(prevVeh, 'CHandlingData', 'fCollisionDamageMult', damageMultiplier);
    SetVehicleHandlingFloat(prevVeh, 'CHandlingData', 'fEngineDamageMult', engineMultiplier);
  }
  prevVeh = -1;
});

function checkIfFailed(veh) {
  updateVehicleHealthData(veh, 'engine', 'Engine');
  updateVehicleHealthData(veh, 'body', 'Body');
  updateVehicleHealthData(veh, 'petrol', 'PetrolTank');

  //Update Values
  vehClass = GetVehicleClass(veh);

  if(health.engine.current > config.failure.safeEngine+1) SetVehicleUndriveable(veh, false);
  if(health.engine.current <= config.failure.safeEngine+1 && !config.failure.limp) SetVehicleUndriveable(veh, true);

  if(veh == prevVeh) {
    if(health.engine.current != 1000 || health.body.current != 1000 || health.petrol.current != 1000) {
      let delta = Math.max(health.engine.delta, health.body.delta, health.petrol.delta);
      if(delta > (health.engine.current - config.failure.safeEngine)) delta *= 0.7;
      if(delta > health.engine.current) delta -= (config.failure.cascadingThreshold / 5);
      health.engine.new = health.engine.last - delta;
      if(health.engine.new > (config.failure.cascadingThreshold + 5) && health.engine.new < config.failure.degradingThreshold) health.engine.new -= (0.035 * config.failure.degrading);
      if(health.engine.new < config.failure.cascadingThreshold) health.engine.new -= (0.1 * config.failure.cascading);
      if(health.engine.new < config.failure.safeEngine) health.engine.new = config.failure.safeEngine;
      if(health.body.new > 0) health.body.new = 0;
    }
  } else {
    weaponMultiplier = GetVehicleHandlingFloat(veh, 'CHandlingData', 'fWeaponDamageMult');
    if(config.failure.weaponMultiplier > 0) SetVehicleHandlingFloat(veh, 'CHandlingData', 'fWeaponDamageMult', config.failure.weaponMultiplier / config.failure.damage.body);
    damageMultiplier = GetVehicleHandlingFloat(veh, 'CHandlingData', 'fCollisionDamageMult');
    SetVehicleHandlingFloat(veh, 'CHandlingData', 'fCollisionDamageMult', Math.pow(damageMultiplier, 0.1));
    engineMultiplier = GetVehicleHandlingFloat(veh, 'CHandlingData', 'fEngineDamageMult');
    SetVehicleHandlingFloat(veh, 'CHandlingData', 'fEngineDamageMult', Math.pow(engineMultiplier, 0.1));
    if(health.body.current < config.failure.cascadingThreshold) health.body.current = config.failure.cascadingThreshold;
    sameVehicle = true;
  }

  if(health.engine.new != health.engine.current) SetVehicleEngineHealth(veh, health.engine.new);
  if(health.body.new != health.body.current) SetVehicleBodyHealth(veh, health.body.new);
  if(health.petrol.new != health.petrol.current) SetVehiclePetrolTankHealth(veh, health.petrol.new);

  health.engine.last = health.engine.new;
  health.body.last = health.body.new;
  health.petrol.last = health.petrol.new;
  prevVeh = veh;

  //Damage
  if(config.failure.torqueEffect || config.failure.limp || config.smoothAccelerator) {
    let factor = 1.0;
    if(config.failure.torqueEffect && health.engine.new < 900) factor = health.engine.new / 900;
    if(config.smoothAccelerator && GetVehicleClass(veh) != 14) {
      let acceleration = GetControlValue(2, 71);
      let braking = GetControlValue(2, 72);
      let speed = GetEntitySpeedVector(veh, true)[1];
      let bForce = brakeForce;
      if(speed >= 1) { //Forward
        if(acceleration > 127) factor *= scale(acceleration, 127, 254, 0.1, 1.0, 10.0 - (config.smoothAccelerationCurve * 2));
        if(braking > 127) {
          bForce = scale(braking, 127, 254, 0.01, brakeForce, 10.0 - (config.smoothBrakeCurve * 2));
          brakingF = true;
        }
      } else if(speed <= -1) { //Reverse
        if(acceleration > 127) {
          bForce = scale(acceleration, 127, 254, 0.01, brakeForce, 10.0 - (config.smoothBrakeCurve * 2));
          brakingB = true;
        }
        if(braking > 127) factor *= scale(braking, 127, 254, 0.1, 1.0, 10.0 - (config.smoothAccelerationCurve * 2));
      } else { //Stationary (basically)
        let vectorlessSpeed = GetEntitySpeed(veh);
        if(vectorlessSpeed < 1) {
          if(brakingF) DisableControlAction(2, 72, true);
          if(brakingB) DisableControlAction(0, 71, true);
          if(brakingF || brakingB) {
            SetVehicleBrake(veh, true);
            SetVehicleBrakeLights(veh, true);
          }
          if(brakingF && GetDisabledControlNormal(2, 72) == 0) brakingF = false;
          if(brakingB && GetDisabledControlNormal(2, 71) == 0) brakingB = false;
        }
        if(bForce > brakeForce - 0.02) bForce = brakeForce;
        SetVehicleHandlingFloat(veh, 'CHandlingData', 'fBrakeForce', bForce);
      }
    }
    if(config.failure.limp && health.engine.new < config.failure.safeEngine) factor = config.failure.limpTorque;
    SetVehicleEngineTorqueMultiplier(veh, factor * gearMulti);
  }
  // if(veh) {
  //   if(GetVehicleEngineHealth(veh) < config.failure.cascading && IsVehicleEngineOn()) {
  //     if(GetVehicleOilLevel(veh) > 0) {
  //       SetVehicleUndriveable(veh, false);
  //       SetVehicleEngineHealth(veh, config.failure.cascading + 5);
  //       SetVehiclePetrolTankHealth(veh, 750);
  //       health.engine.last = config.failure.cascading + 5;
  //       health.petrol.last = 750;
  //       SetVehicleOilLevel(veh, (GetVehicleOilLevel(veh)/3)-0.5);
  //     } else {} // Cant repair
  //   }
  // }
}
