on('prinston_core:character:openInheritanceMenu', () => {
  exports.menu_manager.closeMenu('prinston_core:createCharacter');
  exports.menu_manager.openMenu(
    'prinston_core:createCharacter',
    [
      { type: 'title', title: 'Inheritance', subtitle: 'You are given 1 free \'plastic surgery\', meaning you can change your character\'s appearance later. Just visit the \'Plastic Surgeon\' in game' },
      { type: 'scroll', options: [
        { value: 'mp_m_freemode_01', text: 'Male' },
        { value: 'mp_f_freemode_01', text: 'Female' }
      ], value: character.visual.model == 'mp_m_freemode_01'?0:1, prompt: 'Born Gender', onchange: 'prinston_core:character:inheritance:gender' },
      { type: 'scroll', options: [
        { text: 'Hannah' },
        { text: 'Audrey' },
        { text: 'Jasmine' },
        { text: 'Giselle' },
        { text: 'Amelia' },
        { text: 'Isabella' },
        { text: 'Zoe' },
        { text: 'Ava' },
        { text: 'Camilla' },
        { text: 'Violet' },
        { text: 'Sophia' },
        { text: 'Eveline' },
        { text: 'Nicole' },
        { text: 'Ashley' },
        { text: 'Grace' },
        { text: 'Brianna' },
        { text: 'Natalie' },
        { text: 'Olivia' },
        { text: 'Elizabeth' },
        { text: 'Charlotte' },
        { text: 'Emma' },
        { text: 'Misty' },
      ], value: character.visual.inheritance.mother, prompt: 'Mother', onchange: 'prinston_core:character:inheritance:mother' },
      { type: 'scroll', options: [
        { text: 'Benjamin' },
        { text: 'Daniel' },
        { text: 'Joshua' },
        { text: 'Noah' },
        { text: 'Andrew' },
        { text: 'Joan' },
        { text: 'Alex' },
        { text: 'Isaac' },
        { text: 'Evan' },
        { text: 'Ethan' },
        { text: 'Vincent' },
        { text: 'Angel' },
        { text: 'Diego' },
        { text: 'Adrian' },
        { text: 'Gabriel' },
        { text: 'Michael' },
        { text: 'Santiago' },
        { text: 'Kevin' },
        { text: 'Louis' },
        { text: 'Samuel' },
        { text: 'Anthony' },
        { text: 'Claude' },
        { text: 'Niko' },
        { text: 'John' }
      ], value: character.visual.inheritance.father, prompt: 'Father', onchange: 'prinston_core:character:inheritance:father' },
      { type: 'scroll', options: [
        { text: 'Benjamin' },
        { text: 'Daniel' },
        { text: 'Joshua' },
        { text: 'Noah' },
        { text: 'Andrew' },
        { text: 'Joan' },
        { text: 'Alex' },
        { text: 'Isaac' },
        { text: 'Evan' },
        { text: 'Ethan' },
        { text: 'Vincent' },
        { text: 'Angel' },
        { text: 'Diego' },
        { text: 'Adrian' },
        { text: 'Gabriel' },
        { text: 'Michael' },
        { text: 'Santiago' },
        { text: 'Kevin' },
        { text: 'Louis' },
        { text: 'Samuel' },
        { text: 'Anthony' },
        { text: 'John' },
        { text: 'Niko' },
        { text: 'Claude' },
        { text: 'Hannah' },
        { text: 'Audrey' },
        { text: 'Jasmine' },
        { text: 'Giselle' },
        { text: 'Amelia' },
        { text: 'Isabella' },
        { text: 'Zoe' },
        { text: 'Ava' },
        { text: 'Camilla' },
        { text: 'Violet' },
        { text: 'Sophia' },
        { text: 'Eveline' },
        { text: 'Nicole' },
        { text: 'Ashley' },
        { text: 'Grace' },
        { text: 'Brianna' },
        { text: 'Natalie' },
        { text: 'Olivia' },
        { text: 'Elizabeth' },
        { text: 'Charlotte' },
        { text: 'Emma' },
        { text: 'Misty' }
      ], value: character.visual.inheritance.genetic, prompt: 'Genetic Base', onchange: 'prinston_core:character:inheritance:genetic' },
      createRangeOption(`character.visual.inheritance.shapeMix`, 'Mother <- Shape Match (%) -> Father', false),
      createRangeOption(`character.visual.inheritance.shapeMix`, 'Mother <- Skin Match (%) -> Father', true),
      createRangeOption(`character.visual.inheritance.shapeMix`, 'None <- Genetic Override (%) -> Full', false),
      { type: 'textdisplay', value: 'Continue', prompt: 'Next: Appearance', onselect: 'prinston_core:character:openAppearanceMenu' }
    ],
    'prinston_core:character:openInfoMenu'
  );
});

on('prinston_core:character:inheritance:gender', (index, value) => { character.visual.model = value; updateCharacterModel(); });
on('prinston_core:character:inheritance:mother', (index, value) => { character.visual.inheritance.mother = index; updateCharacterVisually(); });
on('prinston_core:character:inheritance:father', (index, value) => { character.visual.inheritance.father = index; updateCharacterVisually(); });
on('prinston_core:character:inheritance:genetic', (index, value) => { character.visual.inheritance.genetic = index; updateCharacterVisually(); });