function createRangeOption(conf, prompt, invert = false) {
  on('prinston_core:' + conf, (value) => { eval(`${conf} = ${invert?'-1*':''}${value};`); updateCharacterVisually(); });
  return { type: 'number', min: -100, max: 100, value: eval(`${invert?'-1*':''}${conf}`), step: 1, prompt: prompt, onchange: 'prinston_core:' + conf };
}

function createPercentOption(conf, prompt, invert = false) {
  on('prinston_core:' + conf, (value) => { eval(`${conf} = ${invert?'100-':''}${value};`); updateCharacterVisually(); });
  return { type: 'number', min: 0, max: 100, value: eval(`${invert?'100-':''}${conf}`), step: 1, prompt: prompt, onchange: 'prinston_core:' + conf };
}

function createNumberOption(conf, prompt, min = undefined, max = undefined, step = 1, callback = undefined) {
  on('prinston_core:' + conf, (value) => { eval(`${conf} = ${value};`); updateCharacterVisually(); if(callback!=undefined) callback(value);});
  return { type: 'number', name: conf, min: min, max: max, value: eval(`${conf}`), step: step, prompt: prompt, onchange: 'prinston_core:' + conf };
}

function createScrollIndexOption(conf, prompt, options) {
  on('prinston_core:' + conf, (index, value) => { eval(`${conf} = ${index};`); updateCharacterVisually(); });
  return { type: 'scroll', options: options, value: eval(`${conf}`), prompt: prompt, onchange: 'prinston_core:' + conf };
}

function createScrollValueOption(conf, prompt, options) {
  on('prinston_core:' + conf, (index, value) => { eval(`${conf} = ${value};`); updateCharacterVisually(); });
  return { type: 'scroll', options: options, value: eval(`${conf}`), prompt: prompt, onchange: 'prinston_core:' + conf };
}

function createPropOption(conf, slot) {
  return [
    createNumberOption(`${conf}[0]`, 'Style', -1, GetNumberOfPedPropDrawableVariations(PlayerPedId(), slot)-1, 1, (value) => {
      exports.menu_manager.updateMenu('prinston_core:createCharacter', `${conf}[1]`, 'value', 0);
      eval(`${conf}[1]=0`);
      updateCharacterVisually();
      exports.menu_manager.updateMenu('prinston_core:createCharacter', `${conf}[1]`, 'max', GetNumberOfPedPropTextureVariations(PlayerPedId(), slot, eval(`${conf}[0]`))-1);
    }),
    createNumberOption(`${conf}[1]`, 'Texture', 0, GetNumberOfPedPropTextureVariations(PlayerPedId(), slot, eval(`${conf}[0]`))-1, 1),
  ];
}

function createClothingOption(conf, slot) {
  return [
    createNumberOption(`${conf}[0]`, 'Style', 0, GetNumberOfPedDrawableVariations(PlayerPedId(), slot)-1, 1, (value) => {
      exports.menu_manager.updateMenu('prinston_core:createCharacter', `${conf}[1]`, 'value', 0);
      eval(`${conf}[1]=0`);
      updateCharacterVisually();
      exports.menu_manager.updateMenu('prinston_core:createCharacter', `${conf}[1]`, 'max', GetNumberOfPedTextureVariations(PlayerPedId(), slot, eval(`${conf}[0]`))-1);
    }),
    createNumberOption(`${conf}[1]`, 'Texture', 0, GetNumberOfPedTextureVariations(PlayerPedId(), slot, eval(`${conf}[0]`))-1, 1)
  ];
}

function createGloveOption() { // `character.visual.clothing.gloves`, 3
  let conf = character.visual.clothing.torso;
  return [
    { type: 'title', subtitle: 'Gloves', style: subtitleTopper },
    createNumberOption(`character.visual.clothing.gloves[0]`, 'Style', 0, 10, 1, (value) => {
      exports.menu_manager.updateMenu('prinston_core:createCharacter', `character.visual.clothing.gloves[1]`, 'value', 0);
      character.visual.clothing.gloves[1] = 0;
      updateCharacterVisually();
      exports.menu_manager.updateMenu('prinston_core:createCharacter', `character.visual.clothing.gloves[1]`, 'max', GetNumberOfPedTextureVariations(PlayerPedId(), 3, gloveGroups[character.visual.clothing.gloves[0]][character.visual.clothing.torso[0]])-1);
    }),
    createNumberOption(`character.visual.clothing.gloves[1]`, 'Texture', 0, GetNumberOfPedTextureVariations(PlayerPedId(), 3, gloveGroups[character.visual.clothing.gloves[0]][character.visual.clothing.torso[0]])-1, 1),
    { type: 'title', subtitle: 'Torso', style: subtitleTopper },
    createNumberOption(`character.visual.clothing.torso[0]`, 'Style', 0, 14, 1, (value) => {})
  ]
}
