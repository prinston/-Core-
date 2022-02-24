on('prinston_core:character:openCosmeticMenu', () => {
  let hairColors = [];
  for(let i = 0; i < GetNumHairColors(); i++) {
    let color = GetPedHairRgbColor(i);
    hairColors.push({ text: `Color ${i+1}`, style: `color: rgb(${color[0]}, ${color[1]}, ${color[2]})` })
  }
  let makeupColors = [];
  for(let i = 0; i < GetNumMakeupColors(); i++) {
    let color = GetPedMakeupRgbColor(i);
    makeupColors.push({ text: `Color ${i+1}`, style: `color: rgb(${color[0]}, ${color[1]}, ${color[2]})` })
  }
  exports.menu_manager.closeMenu('prinston_core:createCharacter');
  exports.menu_manager.openMenu(
    'prinston_core:createCharacter',
    [
      { type: 'title', title: 'Cosmetic', subtitle: 'Makeup and hair can all be modified later at a salon or barber, nothing here is final' },
      { type: 'title', subtitle: 'Hair', style: subtitleTopper },
      createNumberOption(`character.visual.cosmetic.hair.value`, 'Style', 0, GetNumberOfPedDrawableVariations(PlayerPedId(), 2)-1, 1, (value) => {
        exports.menu_manager.updateMenu(
          'prinston_core:createCharacter',
          'character.visual.cosmetic.hair.texture',
          'max',
          GetNumberOfPedTextureVariations(PlayerPedId(), 2, value)-1
        );
        exports.menu_manager.updateMenu(
          'prinston_core:createCharacter',
          'character.visual.cosmetic.hair.texture',
          'value',
          0
        );
      }),
      createNumberOption(`character.visual.cosmetic.hair.texture`, 'Texture', 0, GetNumberOfPedTextureVariations(PlayerPedId(), 2, )-1),
      createScrollIndexOption(`character.visual.cosmetic.hair.color`, 'Color', hairColors),
      createScrollIndexOption(`character.visual.cosmetic.hair.highlight`, 'Highlight', hairColors),
      { type: 'title', subtitle: 'Eyebrows', style: subtitleTopper },
      createNumberOption(`character.visual.cosmetic.eyebrow.value`, 'Style', 0, GetPedHeadOverlayNum(2)-1),
      createScrollIndexOption(`character.visual.cosmetic.eyebrow.color`, 'Color', hairColors),
      createPercentOption(`character.visual.cosmetic.eyebrow.opacity`, 'Opacity', false),
      { type: 'title', subtitle: 'Facial Hair', style: subtitleTopper },
      createNumberOption(`character.visual.cosmetic.facialhair.value`, 'Style', 0, GetPedHeadOverlayNum(1)-1),
      createScrollIndexOption(`character.visual.cosmetic.facialhair.color`, 'Color', hairColors),
      createPercentOption(`character.visual.cosmetic.facialhair.opacity`, 'Opacity', false),
      { type: 'title', subtitle: 'Chest Hair', style: subtitleTopper },
      createNumberOption(`character.visual.cosmetic.chesthair.value`, 'Style', 0, GetPedHeadOverlayNum(10)-1),
      createScrollIndexOption(`character.visual.cosmetic.chesthair.color`, 'Color', hairColors),
      createPercentOption(`character.visual.cosmetic.chesthair.opacity`, 'Opacity', false),
      { type: 'title', subtitle: 'Makeup', style: subtitleTopper },
      createNumberOption(`character.visual.cosmetic.makeup.value`, 'Style', 0, GetPedHeadOverlayNum(4)-1),
      createScrollIndexOption(`character.visual.cosmetic.makeup.color`, 'Color', makeupColors),
      createPercentOption(`character.visual.cosmetic.makeup.opacity`, 'Opacity', false),
      { type: 'title', subtitle: 'Blush', style: subtitleTopper },
      createNumberOption(`character.visual.cosmetic.blush.value`, 'Style', 0, GetPedHeadOverlayNum(5)-1),
      createScrollIndexOption(`character.visual.cosmetic.blush.color`, 'Color', makeupColors),
      createPercentOption(`character.visual.cosmetic.blush.opacity`, 'Opacity', false),
      { type: 'title', subtitle: 'Lipstick', style: subtitleTopper },
      createNumberOption(`character.visual.cosmetic.lipstick.value`, 'Style', 0, GetPedHeadOverlayNum(8)-1),
      createScrollIndexOption(`character.visual.cosmetic.lipstick.color`, 'Color', makeupColors),
      createPercentOption(`character.visual.cosmetic.lipstick.opacity`, 'Opacity', false),
      { type: 'title', subtitle: 'Blemishes', style: subtitleTopper },
      createNumberOption(`character.visual.cosmetic.blemishes.value`, 'Style', 0, GetPedHeadOverlayNum(0)-1),
      createPercentOption(`character.visual.cosmetic.blemishes.opacity`, 'Opacity', false),
      { type: 'title', subtitle: 'Ageing', style: subtitleTopper },
      createNumberOption(`character.visual.cosmetic.ageing.value`, 'Style', 0, GetPedHeadOverlayNum(3)-1),
      createPercentOption(`character.visual.cosmetic.ageing.opacity`, 'Opacity', false),
      { type: 'title', subtitle: 'Complexion', style: subtitleTopper },
      createNumberOption(`character.visual.cosmetic.complexion.value`, 'Style', 0, GetPedHeadOverlayNum(6)-1),
      createPercentOption(`character.visual.cosmetic.complexion.opacity`, 'Opacity', false),
      { type: 'title', subtitle: 'Sun Damage', style: subtitleTopper },
      createNumberOption(`character.visual.cosmetic.sundamage.value`, 'Style', 0, GetPedHeadOverlayNum(7)-1),
      createPercentOption(`character.visual.cosmetic.sundamage.opacity`, 'Opacity', false),
      { type: 'title', subtitle: 'Moles/Freckles', style: subtitleTopper },
      createNumberOption(`character.visual.cosmetic.moles.value`, 'Style', 0, GetPedHeadOverlayNum(9)-1),
      createPercentOption(`character.visual.cosmetic.moles.opacity`, 'Opacity', false),
      { type: 'title', subtitle: 'Body Blemishes', style: subtitleTopper },
      createNumberOption(`character.visual.cosmetic.bodyblemishes.value`, 'Style', 0, GetPedHeadOverlayNum(11)-1),
      createPercentOption(`character.visual.cosmetic.bodyblemishes.opacity`, 'Opacity', false),
      { type: 'title', subtitle: 'More Blemishes', style: subtitleTopper },
      createNumberOption(`character.visual.cosmetic.bodyblemishes2.value`, 'Style', 0, GetPedHeadOverlayNum(12)-1),
      createPercentOption(`character.visual.cosmetic.bodyblemishes2.opacity`, 'Opacity', false),
      { type: 'textdisplay', value: 'Continue', prompt: 'Next: Clothing', onselect: 'prinston_core:character:openClothingMenu' }
    ],
    'prinston_core:character:openAppearanceMenu'
  );
});
