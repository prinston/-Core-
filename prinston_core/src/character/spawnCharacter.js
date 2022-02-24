on('prinston_core:ui_manager_started', () => {
  emit('ui_manager:run', '$("#prinston_core_info").remove()');
  emit(
    'ui_manager:inject',
    `<div id='prinston_core_info' style='position: fixed; bottom: 0.5vh; left: 40vh; height: 7.7vh; background-color: rgba(0, 0, 0, 0.25); padding: 0.5vh; border-radius: 0.5vh; border-width: 1px; border-color: white; border-style: solid;'><svg viewbox='0 0 100 300' style='margin-right: 0.5vh; height: 7.5vh; width: 2.5vh'><path d="M 50 90 q -45 -40 -45 -65 c 0 -30 45 -30 45 0 c 0 -30 45 -30 45 0 q 0 30 -45 65 z" fill="rgba(255, 85, 85, 0.75)"/><path d="M 20 150 h 67.5 c 10 0 10 10 0 10 h -75 c -10 0 -10 -10 0 -10 z M 10 145 c 0 -40 80 -45 80 0 z M 10 165 h 55 v 5 c 0 5 5 5 5 0 v -5 h 5 v 2 c 0 5 5 5 5 0 v -2 h 10 v 10 c 0 10 -10 10 -10 10 h -60 c -10 0 -10 -10 -10 -10 z" fill="rgba(255, 160, 85, 0.75)"/><path d="M 50 205 c 10 20 20 35 20 60 c 0 20 -20 20 -20 20 c 0 0 -20 0 -20 -20 c 0 -25 10 -40 20 -60 z" fill="rgba(85, 85, 255, 0.75)"/></svg><svg viewBox="0 0 100 75" style="width: 10vh; height: 7.5vh; border-radius: 0.5vh; border-width: 0.1vh; border-color: white; border-style: solid;"><rect id="healthBar" x="0" y="0" width="100" height="25" fill="rgba(255, 85, 85, 0.75)"/><rect id="hungerBar" x="0" y="25" width="100" height="25" fill="rgba(255, 160, 85, 0.75)"/><rect id="waterBar" x="0" y="50" width="100" height="25" fill="rgba(85, 85, 255, 0.75)"/><text id="healthText" x=50 y=15 fill="white" style='font-size: 2vh;' dominant-baseline="middle" text-anchor="middle">50</text><text id="hungerText" x=50 y=40 fill="white" style='font-size: 2vh;' dominant-baseline="middle" text-anchor="middle">100</text><text id="waterText" x=50 y=65 fill="white" style='font-size: 2vh;' dominant-baseline="middle" text-anchor="middle">100</text></svg></div>`
  );
});

function renderSpawnCam() {
  exports.helper.whenResourceStarts('ui_manager', 'prinston_core:ui_manager_started');
  emit('prinston_core:ui_manager_started');

  setInterval(() => {
    let health = (GetEntityHealth(PlayerPedId())-100) / 100;
    let hunger = character.hunger / 100;
    let water = character.water / 100;
    if(health > 1) health = 1;
    if(health < 0) health = 0;
    emit(
      'ui_manager:run',
      `$('#healthBar').attr('width', ${(health*100)});
      $('#healthText').text(${parseInt(health*100)});
      $('#hungerBar').attr('width', ${(hunger*100)});
      $('#hungerText').text(${parseInt(hunger*100)});
      $('#waterBar').attr('width', ${(water*100)});
      $('#waterText').text(${parseInt(water*100)});`
    );
  }, 10);

  if(character.asn == undefined || character.asn == '') {
    createNotification({
      title: { text: 'Welcome to ' + config.serverName },
      subtitle: { text: 'Goto the courthouse to obtain your ASN (Anti-social security number)'}
    });
  } else {
    createNotification({
      title: { text: 'Welcome back to ' + config.serverName },
      subtitle: { text: 'Enjoy your stay.'}
    });
  }

  SetEntityCoords(
    PlayerPedId(),
    character.position.x,
    character.position.y,
    character.position.z,
    true, false, false, false
  );
  SetEntityHeading(PlayerPedId(), character.position.h);
  setTimeout(() => {
    canSavePosition = true;
  }, 60000);

  let activePlayers = GetActivePlayers();
  for(let playerI in activePlayers) {
    let play = activePlayers[playerI];
    SetEntityVisible(GetPlayerPed(play), true);
  }

  cam.moveTo([
    character.position.x,
    character.position.y,
    600,
  ], [-90, GetGameplayCamRot()[1], GetGameplayCamRot()[2]], 5000, 0.25, 0.25, () => {
    clearTick(moveTick);
    setTimeout(() => {
      SetEntityCoords(
        PlayerPedId(),
        character.position.x,
        character.position.y,
        character.position.z,
        true, false, false, false
      );
      SetEntityHeading(PlayerPedId(), character.position.h);
      SetEntityInvincible(PlayerPedId(), false);
      SetEntityVisible(PlayerPedId(), true);
    });
    cam.moveTo(GetGameplayCamCoords(), GetGameplayCamRot(), 1000, 1, 1, () => {
      uploadInfo();
      cam.deactivate();
    });
  });
}
