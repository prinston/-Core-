on('prinston_core:character:openIntroMenu', () => {
  exports.menu_manager.closeMenu('prinston_core:createCharacter');
  exports.menu_manager.openMenu(
    'prinston_core:createCharacter',
    [
      { type: 'title', title: config.serverName, subtitle: config.serverMessage },
      { type: 'custom', value: '<p style:"font-height: 0.75vh;">' + config.serverDescription + '</p>' },
      { type: 'textdisplay', value: 'Continue', prompt: 'Next: Inheritance', onselect: 'prinston_core:character:openInfoMenu' }
    ],
    'none'
  );
});
