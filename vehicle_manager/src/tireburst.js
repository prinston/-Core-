let burstVariable = (1-(config.randomTireBurstPercent/100));
let burstChance = parseInt(100000 * burstVariable);
let burstValue = parseInt(Math.random() * burstChance);

function tryRandomTireBurst(veh) {
  for(let i = 0; i < 100*burstVariable; i++) if(Math.random() < burstVariable) return;
  let roll = parseInt(Math.random() * burstChance);
  if(roll == burstValue) {
    if(GetVehicleTyresCanBurst(veh)) {
      let tyre = parseInt(Math.random() * (9));
      if(tyre == 7) tyre = 45;
      if(tyre == 8) tyre = 47
      SetVehicleTyreBurst(veh, tyre, false, 1000);
      burstValue = parseInt(Math.random() * burstChance);
    }
  }
}
