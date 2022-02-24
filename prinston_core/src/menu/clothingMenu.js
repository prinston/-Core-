on('prinston_core:character:openClothingMenu', () => {
  exports.menu_manager.closeMenu('prinston_core:createCharacter');
  exports.menu_manager.openMenu(
    'prinston_core:createCharacter',
    [
      { type: 'title', title: 'Clothing', subtitle: 'You can purchase clothing later at designated shops' },
      { type: 'title', subtitle: 'Hat', style: subtitleTopper },
      ...createPropOption(`character.visual.clothing.hat`, 0),
      { type: 'title', subtitle: 'Mask', style: subtitleTopper },
      ...createClothingOption(`character.visual.clothing.mask`, 1),
      { type: 'title', subtitle: 'Glasses', style: subtitleTopper },
      ...createPropOption(`character.visual.clothing.glasses`, 1),
      { type: 'title', subtitle: 'Earwear', style: subtitleTopper },
      ...createPropOption(`character.visual.clothing.ears`, 2),
      { type: 'title', subtitle: 'Neck', style: subtitleTopper },
      ...createClothingOption(`character.visual.clothing.accessory`, 7),
      { type: 'title', subtitle: 'Overshirt', style: subtitleTopper },
      ...createClothingOption(`character.visual.clothing.overlay`, 11),
      { type: 'title', subtitle: 'Undershirt', style: subtitleTopper },
      ...createClothingOption(`character.visual.clothing.undershirt`, 8),
      ...createGloveOption(),
      { type: 'title', subtitle: 'Bags', style: subtitleTopper },
      ...createClothingOption(`character.visual.clothing.bag`, 5),
      { type: 'title', subtitle: 'Armor', style: subtitleTopper },
      ...createClothingOption(`character.visual.clothing.armor`, 9),
      { type: 'title', subtitle: 'Decals', style: subtitleTopper },
      ...createClothingOption(`character.visual.clothing.badge`, 10),
      { type: 'title', subtitle: 'Watch', style: subtitleTopper },
      ...createPropOption(`character.visual.clothing.watch`, 6),
      { type: 'title', subtitle: 'Wristwear', style: subtitleTopper },
      ...createPropOption(`character.visual.clothing.bracelet`, 7),
      { type: 'title', subtitle: 'Lowerwear', style: subtitleTopper },
      ...createClothingOption(`character.visual.clothing.leg`, 4),
      { type: 'title', subtitle: 'Shoes', style: subtitleTopper },
      ...createClothingOption(`character.visual.clothing.shoes`, 6),
      //{ type: 'textdisplay', value: 'Continue', prompt: 'Next: Appearance', onselect: 'prinston_core:character:openAppearanceMenu' }
      { type: 'textdisplay', value: 'Finish', prompt: 'Begin RP', onselect: 'prinston_core:character:complete' }
    ],
    'prinston_core:character:openCosmeticMenu'
  );
});
