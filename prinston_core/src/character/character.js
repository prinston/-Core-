const mothers = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45];
const fathers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44];

function processVisualPercent(value) {
  return value/100;
}

function processVisualRange(value) {
  return (value+100)/200;
}

function loadPedOverlay(ped, index, visual, add) {
  SetPedHeadOverlay(ped, index, eval(`visual.cosmetic.${add}.value`), processVisualPercent(eval(`visual.cosmetic.${add}.opacity`)));
}

function setPedProp(ped, slot, data) {
  if(data[0] != -1) {
    SetPedPropIndex(ped, slot, ...data, true);
  }
}

function updatePedVisualModel(ped, visual) {
  SetPedHeadBlendData(
    ped,
    mothers[visual.inheritance.mother],
    fathers[visual.inheritance.father],
    visual.inheritance.genetic,
    mothers[visual.inheritance.mother],
    fathers[visual.inheritance.father],
    visual.inheritance.genetic,
    processVisualRange(visual.inheritance.shapeMix),
    processVisualRange(visual.inheritance.skinMix),
    processVisualRange(visual.inheritance.geneticMix),
    false
  );
  SetPedEyeColor(ped, visual.appearance.eye.color);
  SetPedFaceFeature(ped, 0, processVisualPercent(visual.appearance.nose.width));
  SetPedFaceFeature(ped, 1, processVisualPercent(visual.appearance.nose.peak.height));
  SetPedFaceFeature(ped, 2, processVisualPercent(visual.appearance.nose.peak.length));
  SetPedFaceFeature(ped, 3, processVisualPercent(visual.appearance.nose.bone.height));
  SetPedFaceFeature(ped, 4, processVisualPercent(visual.appearance.nose.peak.bend));
  SetPedFaceFeature(ped, 5, processVisualPercent(visual.appearance.nose.bone.twist));
  SetPedFaceFeature(ped, 6, processVisualPercent(visual.appearance.eyebrow.height));
  SetPedFaceFeature(ped, 7, processVisualPercent(visual.appearance.eyebrow.length));
  SetPedFaceFeature(ped, 8, processVisualPercent(visual.appearance.cheek.bone.height));
  SetPedFaceFeature(ped, 9, processVisualPercent(visual.appearance.cheek.bone.width));
  SetPedFaceFeature(ped, 10, processVisualPercent(visual.appearance.cheek.width));
  SetPedFaceFeature(ped, 11, processVisualPercent(visual.appearance.eye.open));
  SetPedFaceFeature(ped, 12, processVisualPercent(visual.appearance.lips));
  SetPedFaceFeature(ped, 13, processVisualPercent(visual.appearance.jaw.width));
  SetPedFaceFeature(ped, 14, processVisualPercent(visual.appearance.jaw.length));
  SetPedFaceFeature(ped, 15, processVisualPercent(visual.appearance.chin.height));
  SetPedFaceFeature(ped, 16, processVisualPercent(visual.appearance.chin.length));
  SetPedFaceFeature(ped, 17, processVisualPercent(visual.appearance.chin.width));
  SetPedFaceFeature(ped, 18, processVisualPercent(visual.appearance.chin.depth));
  SetPedFaceFeature(ped, 19, processVisualPercent(visual.appearance.neck));

  loadPedOverlay(ped, 0, visual, 'blemishes');
  loadPedOverlay(ped, 1, visual, 'facialhair');
  loadPedOverlay(ped, 2, visual, 'eyebrow');
  loadPedOverlay(ped, 3, visual, 'ageing');
  loadPedOverlay(ped, 4, visual, 'makeup');
  loadPedOverlay(ped, 5, visual, 'blush');
  loadPedOverlay(ped, 6, visual, 'complexion');
  loadPedOverlay(ped, 7, visual, 'sundamage');
  loadPedOverlay(ped, 8, visual, 'lipstick');
  loadPedOverlay(ped, 9, visual, 'moles');
  loadPedOverlay(ped, 10, visual, 'chesthair');
  loadPedOverlay(ped, 11, visual, 'bodyblemishes');
  loadPedOverlay(ped, 12, visual, 'bodyblemishes2');

  SetPedHeadOverlayColor(ped, 1, 1, visual.cosmetic.facialhair.color, visual.cosmetic.facialhair.color);
  SetPedHeadOverlayColor(ped, 2, 1, visual.cosmetic.eyebrow.color, visual.cosmetic.eyebrow.color);
  SetPedHeadOverlayColor(ped, 10, 1, visual.cosmetic.chesthair.color, visual.cosmetic.chesthair.color);

  SetPedHeadOverlayColor(ped, 4, 2, visual.cosmetic.makeup.color, visual.cosmetic.makeup.color);
  SetPedHeadOverlayColor(ped, 5, 2, visual.cosmetic.blush.color, visual.cosmetic.blush.color);
  SetPedHeadOverlayColor(ped, 8, 2, visual.cosmetic.lipstick.color, visual.cosmetic.lipstick.color);

  SetPedComponentVariation(ped, 2, visual.cosmetic.head.value, visual.cosmetic.head.texture, visual.cosmetic.head.palette);
  SetPedComponentVariation(ped, 2, visual.cosmetic.hair.value, visual.cosmetic.hair.texture, visual.cosmetic.hair.palette);
  SetPedHairColor(ped, visual.cosmetic.hair.color, visual.cosmetic.hair.highlight);

  SetPedComponentVariation(ped, 1, ...visual.clothing.mask);
  SetPedComponentVariation(ped, 3, getGlovedTorsoFromIndex(visual.clothing.gloves[0], visual.clothing.torso[0]), visual.clothing.gloves[1], visual.clothing.gloves[2]);
  SetPedComponentVariation(ped, 4, ...visual.clothing.leg);
  SetPedComponentVariation(ped, 5, ...visual.clothing.bag);
  SetPedComponentVariation(ped, 6, ...visual.clothing.shoes);
  SetPedComponentVariation(ped, 7, ...visual.clothing.accessory);
  SetPedComponentVariation(ped, 8, ...visual.clothing.undershirt);
  SetPedComponentVariation(ped, 9, ...visual.clothing.armor);
  SetPedComponentVariation(ped, 10, ...visual.clothing.badge);
  SetPedComponentVariation(ped, 11, ...visual.clothing.overlay);

  ClearAllPedProps(ped);

  setPedProp(ped, 0, visual.clothing.hat);
  setPedProp(ped, 1, visual.clothing.glasses);
  setPedProp(ped, 2, visual.clothing.ears);
  setPedProp(ped, 6, visual.clothing.watch);
  setPedProp(ped, 7, visual.clothing.bracelet);
}

function updateCharacterVisually() {
  updatePedVisualModel(PlayerPedId(), character.visual);
}

function updateCharacterModel() {
  if(GetEntityModel(PlayerPedId()) != GetHashKey(character.visual.model)) {
    loadHash(character.visual.model, (hash) => {
      SetPlayerModel(PlayerId(), hash);
      updateCharacterVisually();
    });
  } else updateCharacterVisually();
}

let clothingVariations = {
  hat: {
    male: {},
    female: {}
  },
  jacket: {
    male: {},
    female: {}
  },
  hair: {
    male: {},
    female: {}
  },
  bag: {
    male: {},
    female: {}
  }
}

let HAT = 0;
let JACKET = 1;
let HAIR = 2;
let BAG = 3;
let GLOVES = 4;

function addVariation(type, isMale, from, to) {
  let t;
  let g;
  switch(type) {
    case HAT: t = 'hat'; break;
    case JACKET: t = 'jacket'; break;
    case HAIR: t = 'hair'; break;
    case BAG: t = 'bag'; break;
    case GLOVES: t = 'gloves'; break;
  }
  eval(`if(clothingVariations.${t}.${g}[${from}]==undefined) clothingVariations.${t}.${g}[${from}] = [${to}];
        else clothingVariations.${t}.${g}[${from}].push(${to});
        if(clothingVariations.${t}.${g}[${to}]==undefined) clothingVariations.${t}.${g}[${to}] = [${from}];
        else clothingVariations.${t}.${g}[${to}].push(${from});`);
}
