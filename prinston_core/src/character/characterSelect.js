let hoveringCharacterId = 0;
let characterCircle;
let cameraCircle;
let cam;

let wantedDegree;
let spawnedEntities;

function calculateCharacterPosition(index) {
  let deg = 360 * ((1/config.characterSelection.characterCount) * (index + 1));
  return {
    x: characterCircle.posX(deg),
    y: characterCircle.posY(deg),
    degree: deg
  };
}

function spawnCharacterSelectPed(index) {
  if(characterSelectTick == undefined) return;
  if(spawnedEntities[index] != undefined) {
    DeleteEntity(spawnedEntities[index]);
  }
  let pos = calculateCharacterPosition(index);
  pos.x += config.characterSelection.position.x;
  pos.y += config.characterSelection.position.y;
  pos.z = config.characterSelection.position.z - 1;
  if(characterInfo[index] == undefined) {
    loadHash('mp_m_freemode_01', (hash) => {
      if(characterSelectTick == undefined) return;
      spawnedEntities[index] = CreatePed(0, hash, pos.x, pos.y, pos.z, 0, false, true);
      SetEntityAsNoLongerNeeded(spawnedEntities[index]);
    });
  } else {
    loadHash(characterInfo[index].visual.model, (hash) => {
      if(characterSelectTick == undefined) return;
      spawnedEntities[index] = CreatePed(0, hash, pos.x, pos.y, pos.z, 0, false, true);
      updatePedVisualModel(spawnedEntities[index], characterInfo[index].visual);
      SetEntityAsNoLongerNeeded(spawnedEntities[index]);
    });
  }
}

let hasOfficiallyCheckedAndIgnoreFutureCalls = false;
on('prinston_core:selectedCharacter', () => {
  if(!hasOfficiallyCheckedAndIgnoreFutureCalls) {
    hasOfficiallyCheckedAndIgnoreFutureCalls = true;
    clearTick(characterSelectTick);
    characterSelectTick = undefined;
    SetEntityVisible(PlayerPedId(), true, 0);
    SetEntityAlpha(PlayerPedId(), 255);
    exports.menu_manager.closeMenu('prinston_core:character');
    for(let index in spawnedEntities) {
      if(DoesEntityExist(spawnedEntities[index])) {
        let opacity = GetEntityAlpha(spawnedEntities[index]);
        let deleter = setInterval(() => {
          if(opacity > 0) {
            opacity -= 5;
            if(DoesEntityExist(spawnedEntities[index])) {
              SetEntityAlpha(spawnedEntities[index], opacity);
            } else clearInterval(deleter)
          } else {
            DeleteEntity(spawnedEntities[index]);
            spawnedEntities[index] = undefined;
            clearInterval(deleter);
          }
        }, 10);
      }
    }
    if(character == undefined) {
      if(characterInfo[hoveringCharacterId] == undefined) {
        character = {};
        onNet('prinston_core:characterCreated', (data) => {
          character = data;
          updateCharacterModel()
          beginCreateCharacter();
        });
        emitNet('mysql:createCharacterData', discordId, hoveringCharacterId, 'prinston_core:characterCreated');
      } else {
        character = characterInfo[hoveringCharacterId];
        delete characterInfo;
        characterInfo = undefined;
        updateCharacterModel();
        if(character.finishedCreation) renderSpawnCam();
        else beginCreateCharacter();
      }
      delete characterInfo;
      characterInfo = undefined;
    }
  }
});

function displayMenu() {
  exports.menu_manager.openMenu(
    'prinston_core:character', //Menu name
    [
      { type: 'title', title: config.serverName, subtitle: 'Select your character, once selected you will have to disconnect and reconnect to change' },
      { type: 'textdisplay', name: 'first_name', value: characterInfo[hoveringCharacterId]==undefined?'New Character':characterInfo[hoveringCharacterId].first_name, prompt: 'First Name', onselect: 'prinston_core:selectedCharacter'},
      { type: 'textdisplay', name: 'last_name', value: characterInfo[hoveringCharacterId]==undefined?'':characterInfo[hoveringCharacterId].last_name, prompt: 'Last Name', onselect: 'prinston_core:selectedCharacter'},
      { type: 'textdisplay', name: 'cash', value: characterInfo[hoveringCharacterId]==undefined?'':formatMoney(characterInfo[hoveringCharacterId].cash),  prompt: 'Cash', onselect: 'prinston_core:selectedCharacter'},
      { type: 'textdisplay', name: 'bank', value: characterInfo[hoveringCharacterId]==undefined?'':formatMoney(characterInfo[hoveringCharacterId].bank),  prompt: 'Bank', onselect: 'prinston_core:selectedCharacter'},
      { type: 'textdisplay', name: 'dob', value: characterInfo[hoveringCharacterId]==undefined?'':getDOB(
        characterInfo[hoveringCharacterId].dob.month,
        characterInfo[hoveringCharacterId].dob.day,
        characterInfo[hoveringCharacterId].dob.year
      ), prompt: 'Date of Birth', onselect: 'prinston_core:selectedCharacter'},
    ],
    'none' //Back event
  );
  if(characterInfo[hoveringCharacterId] == undefined) {
    emit('menu_manager:updateMenu', 'prinston_core:character', 'first_name', 'value', 'New Character');
    emit('menu_manager:updateMenu', 'prinston_core:character', 'last_name', 'value', '');
    emit('menu_manager:updateMenu', 'prinston_core:character', 'cash', 'value', '');
    emit('menu_manager:updateMenu', 'prinston_core:character', 'bank', 'value', '');
    emit('menu_manager:updateMenu', 'prinston_core:character', 'dob', 'value', '');
  } else {
    emit('menu_manager:updateMenu', 'prinston_core:character', 'first_name', 'value', characterInfo[hoveringCharacterId].first_name==undefined?'N/A':characterInfo[hoveringCharacterId].first_name);
    emit('menu_manager:updateMenu', 'prinston_core:character', 'last_name', 'value', characterInfo[hoveringCharacterId].last_name==undefined?'N/A':characterInfo[hoveringCharacterId].last_name);
    emit('menu_manager:updateMenu', 'prinston_core:character', 'cash', 'value', formatMoney(characterInfo[hoveringCharacterId].cash));
    emit('menu_manager:updateMenu', 'prinston_core:character', 'bank', 'value', formatMoney(characterInfo[hoveringCharacterId].bank));
    emit('menu_manager:updateMenu', 'prinston_core:character', 'dob', 'value', getDOB(
      characterInfo[hoveringCharacterId].dob.month,
      characterInfo[hoveringCharacterId].dob.day,
      characterInfo[hoveringCharacterId].dob.year
    ));
  }
}

let moveTick;
let prevCoord;
let characterSelectTick;
setTimeout(() => {
  setTimeout(() => {
    if(spawnedEntities == undefined) {
      spawnedEntities = [];
      for(let i = 0; i < config.characterSelection.characterCount; i++) {
        spawnCharacterSelectPed(i);
      }
  }
  }, 1000);

  moveTick = setTick(() => {
    HideHudAndRadarThisFrame();
    for(let i = 0; i < 400; i++) {
      DisableControlAction(0, i, true);
      DisableControlAction(1, i, true);
      DisableControlAction(2, i, true);
    }
    if(DoesEntityExist(PlayerPedId())) {
      SetEntityInvincible(PlayerPedId(), true);
      SetEntityCoords(
        PlayerPedId(),
        config.characterSelection.position.x,
        config.characterSelection.position.y,
        config.characterSelection.position.z - 1,
        true,
        false,
        false,
        false
      );
      SetEntityHeading(PlayerPedId(), 0);
      PlaceObjectOnGroundProperly(PlayerPedId());
    }
    let players = GetActivePlayers();
    for(let i in players) {
      let ped = GetPlayerPed(players[i]);
      SetEntityVisible(ped, false);
    }
  });
  characterSelectTick = setTick(() => {
    if(config == undefined) { return; }
    if(DoesEntityExist(PlayerPedId())) {
      playerCoords = GetEntityCoords(PlayerPedId());
      SetEntityVisible(PlayerPedId(), false, 0);
    }
    if(characterCircle == undefined) {
      ClearArea(
        config.characterSelection.position.x,
        config.characterSelection.position.y,
        config.characterSelection.position.z,
        config.characterSelection.radius * 5,
        true, false, false, false
      );
      characterCircle = new Circle(config.characterSelection.radius);
      cameraCircle = new Circle(config.characterSelection.radius + 3);
    }
    if(characterCircle != undefined && character == undefined) {
      if(exports.menu_manager != undefined) {
        if(exports.menu_manager.getActiveMenu != undefined) {
          if(exports.menu_manager.getActiveMenu() != 'prinston_core:character') {
            displayMenu();
          }
        }
      }
      if(DoesEntityExist(PlayerPedId())) {
        SetEntityInvincible(PlayerPedId(), true);
        SetEntityCoords(
          PlayerPedId(),
          config.characterSelection.position.x,
          config.characterSelection.position.y,
          config.characterSelection.position.z,
          true, false, false, false
        );

        let posOffset = GetOffsetFromEntityGivenWorldCoords(PlayerPedId(), config.characterSelection.position.x, config.characterSelection.position.y, config.characterSelection.position.z);
        if(posOffset[0] < 1 && posOffset[1] < 1 && posOffset[2] < 1 && posOffset[2] > -1.5) {
          wantedDegree = validateDegree(360 * ((1/config.characterSelection.characterCount) * (hoveringCharacterId + 1)));

          if(cam == undefined) {
            cam = new Camera();
            cam.activate();
          }

          for(let i = 0; i < config.characterSelection.characterCount; i++) {
            let pos = calculateCharacterPosition(i);
            pos.x += config.characterSelection.position.x;
            pos.y += config.characterSelection.position.y;
            pos.z = config.characterSelection.position.z;
            if(spawnedEntities != undefined) {
              if(spawnedEntities[i] != undefined) {
                let ped = spawnedEntities[i];
                SetEntityAlpha(ped, characterInfo[i]==undefined?100:255, false);
                ClearPedTasks(ped);
                SetEntityInvincible(ped, true);
                ClearPedBloodDamage(ped);
                SetPedAlertness(ped, 0);
                SetPedAllowedToDuck(ped, false);
                SetPedCanRagdoll(ped, false);
                ClearPedTasks(ped);
                SetEntityCoords(ped, pos.x, pos.y, pos.z-1, true, false, false, false);
                SetEntityHeading(ped, validateDegree(pos.degree-90));
                PlaceObjectOnGroundProperly(ped);
              } else {
                spawnCharacterSelectPed(i);
              }
            }
            DrawMarker(11 + i, pos.x, pos.y, pos.z + 1, 0, 0, 0, 0, 0, validateDegree(pos.degree + 90), 0.25, 0.25, 0.25, 255, 255, 255, 255, false, false, 2, false, null, null, false);
          }

          // Handle camera degree
          if(!cam.isMoving()) {
            let left = IsAnyDisabledControlJustPressed(config.characterSelection.keys.left);
            let right = IsAnyDisabledControlJustPressed(config.characterSelection.keys.right);
            if(!IsPauseMenuActive()) {
              if(left && !right) { // Left
                hoveringCharacterId--;
                if(hoveringCharacterId < 0) hoveringCharacterId = config.characterSelection.characterCount-1;
              } else if(right && !left) { // Right
                hoveringCharacterId++;
                if(hoveringCharacterId >= config.characterSelection.characterCount) hoveringCharacterId = 0;
              }
              if(left || right) {
                if(characterInfo[hoveringCharacterId] == undefined) {
                  emit('menu_manager:updateMenu', 'prinston_core:character', 'first_name', 'value', 'New Character');
                  emit('menu_manager:updateMenu', 'prinston_core:character', 'last_name', 'value', '');
                  emit('menu_manager:updateMenu', 'prinston_core:character', 'cash', 'value', '');
                  emit('menu_manager:updateMenu', 'prinston_core:character', 'bank', 'value', '');
                  emit('menu_manager:updateMenu', 'prinston_core:character', 'dob', 'value', '');
                } else {
                  emit('menu_manager:updateMenu', 'prinston_core:character', 'first_name', 'value', characterInfo[hoveringCharacterId].first_name==undefined?'N/A':characterInfo[hoveringCharacterId].first_name);
                  emit('menu_manager:updateMenu', 'prinston_core:character', 'last_name', 'value', characterInfo[hoveringCharacterId].last_name==undefined?'N/A':characterInfo[hoveringCharacterId].last_name);
                  emit('menu_manager:updateMenu', 'prinston_core:character', 'cash', 'value', formatMoney(characterInfo[hoveringCharacterId].cash));
                  emit('menu_manager:updateMenu', 'prinston_core:character', 'bank', 'value', formatMoney(characterInfo[hoveringCharacterId].bank));
                  emit('menu_manager:updateMenu', 'prinston_core:character', 'dob', 'value', getDOB(
                    characterInfo[hoveringCharacterId].dob.month,
                    characterInfo[hoveringCharacterId].dob.day,
                    characterInfo[hoveringCharacterId].dob.year
                  ));
                }
              }
            }
          }

          if(!cam.isMoving()) {
            if(prevCoord == undefined || (prevCoord[0] != cameraCircle.posX(wantedDegree) + config.characterSelection.position.x || prevCoord[1] != cameraCircle.posY(wantedDegree)  + config.characterSelection.position.y)) {
              prevCoord = [];
              prevCoord[0] = cameraCircle.posX(wantedDegree) + config.characterSelection.position.x;
              prevCoord[1] = cameraCircle.posY(wantedDegree) + config.characterSelection.position.y;
              prevCoord[2] = config.characterSelection.position.z;
              cam.moveTo(prevCoord, [0, 0, wantedDegree+90]);
            }
          }
        }
      }
    }
  });
}, 2000);
