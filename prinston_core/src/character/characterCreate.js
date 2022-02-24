function getLastDate() {
  return new Date(character.dob.year, character.dob.month, 0).getDate();
}

function calculateAge() {
  let res = time.year - character.dob.year - 1;
  if(character.dob.month < time.month) res += 1;
  else if(character.dob.month == time.month) {
    if(character.dob.day <= time.day) res += 1;
  }
  return res;
}

let camTick;

on('prinston_core:character:complete', () => {
  clearTick(camTick);
  exports.menu_manager.closeMenu('prinston_core:createCharacter');
  character.finishedCreation = true;
  renderSpawnCam();
});

function beginCreateCharacter() {
  console.log(character);
  character.dob.year = parseInt(((time.year-16)+(time.year-80))/2);
  emit('prinston_core:character:openIntroMenu');
  camTick = setTick(renderCharacterCreateCameraTick);
}

let zoom = 0;
let yOffset = 0;

function renderCharacterCreateCameraTick() {
  if(DoesEntityExist(PlayerPedId())) {
    SetEntityInvincible(PlayerPedId(), true);
    SetEntityCoords(
      PlayerPedId(),
      config.characterSelection.position.x,
      config.characterSelection.position.y,
      GetGroundZFor_3dCoord(
        config.characterSelection.position.x,
        config.characterSelection.position.y,
        config.characterSelection.position.z
      )[1], true, false, false, false
    );
    PlaceObjectOnGroundProperly(PlayerPedId());
    playerCoords = GetEntityCoords(PlayerPedId());
    SetEntityVisible(PlayerPedId(), true, 0);
  }
  let xMotion = -GetDisabledControlNormal(0, 66)*4;
  let yMotion = -GetDisabledControlNormal(0, 67)/5;
  let zMotion = -GetDisabledControlNormal(0, 334)/15;

  wantedDegree += xMotion;
  wantedDegree = validateDegree(wantedDegree);

  zoom += zMotion;
  if(zoom < 0) zoom = 0;
  if(zoom > config.characterSelection.radius - 0.45) zoom = config.characterSelection.radius - 0.45;

  yOffset += yMotion;
  if(yOffset < -0.75) yOffset = -0.75;
  if(yOffset > 1) yOffset = 1;

  cameraCircle.setRadius(config.characterSelection.radius - zoom);

  prevCoord[0] = cameraCircle.posX(wantedDegree) + config.characterSelection.position.x;
  prevCoord[1] = cameraCircle.posY(wantedDegree) + config.characterSelection.position.y;
  prevCoord[2] = config.characterSelection.position.z + yOffset;

  cam.setCoords(...prevCoord);
  cam.setRotation(0, 0, validateDegree(wantedDegree + 90));

  // cam.setRadius(2);
  // cam.setDegree(cam.getDegree() + xMotion);
  //
  // cam.setRelativePosition(0, 0, cam.getRelativePosition()[2] + yMotion);
  // if(cam.getRelativePosition()[2] > 1) cam.setRelativePosition(0, 0, 1);
  // if(cam.getRelativePosition()[2] < -0.5) cam.setRelativePosition(0, 0, -0.5);
  //
  // cam.setZoom(cam.getZoom() + zMotion);
  // if(cam.getZoom() > 1) cam.setZoom(1);
  // if(cam.getZoom() < 0) cam.setZoom(0);
  //
  // cam.render();
}
