on('prinston_core:character:info:first_name', (first_name) => {
  character.first_name = first_name
});
on('prinston_core:character:info:last_name', (last_name) => {
  character.last_name = last_name
});
on('prinston_core:character:info:dob:month', (index, month) => {
  month = parseInt(month + '');
  character.dob.month = month;
  exports.menu_manager.updateMenu(
    'prinston_core:createCharacter',
    'dob_day',
    'max',
    getLastDate() + ''
  );
  exports.menu_manager.updateMenu(
    'prinston_core:createCharacter',
    'age',
    'value',
    calculateAge() + ' y/o'
  );
});
on('prinston_core:character:info:dob:day', (day) => {
  day = parseInt(day + '');
  character.dob.day = day;
  exports.menu_manager.updateMenu(
    'prinston_core:createCharacter',
    'age',
    'value',
    calculateAge() + ' y/o'
  );
});
on('prinston_core:character:info:dob:year', (year) => {
  console.log(year);
  year = parseInt(year + '');
  character.dob.year = year;
  exports.menu_manager.updateMenu(
    'prinston_core:createCharacter',
    'dob_day',
    'max',
    getLastDate() + ''
  );
  exports.menu_manager.updateMenu(
    'prinston_core:createCharacter',
    'age',
    'value',
    calculateAge() + ' y/o'
  );
});

on('prinston_core:character:openInfoMenu', () => {
  console.log(character);
  console.log(character.dob.year);
  exports.menu_manager.closeMenu('prinston_core:createCharacter');
  exports.menu_manager.openMenu(
    'prinston_core:createCharacter',
    [
      { type: 'title', title: 'Info', subtitle: 'You can change all this information later at the building labeled \'Superior Court\' to petition for your name change'},
      { type: 'text', name: 'first_name', value: character.first_name, max: 32, prompt: 'First Name', onchange: 'prinston_core:character:info:first_name' },
      { type: 'text', name: 'last_name', value: character.last_name, max: 32, prompt: 'Last Name', onchange: 'prinston_core:character:info:last_name'  },
      { type: 'scroll', name: 'dob_month', options: [
        { value: '1', text: 'January' },
        { value: '2', text: 'February' },
        { value: '3', text: 'March' },
        { value: '4', text: 'April' },
        { value: '5', text: 'May' },
        { value: '6', text: 'June' },
        { value: '7', text: 'July' },
        { value: '8', text: 'August' },
        { value: '9', text: 'September' },
        { value: '10', text: 'October' },
        { value: '11', text: 'November' },
        { value: '12', text: 'December' },
      ], value: character.dob.month-1, prompt: 'Birth Month', onchange: 'prinston_core:character:info:dob:month' },
      { type: 'number', name: 'dob_day', prompt: 'Birth Day', min: 1, value: character.dob.day, max: 31, step: 1, onchange: 'prinston_core:character:info:dob:day' },
      { type: 'number', name: 'dob_year', prompt: 'Birth Year', min: time.year-90, value: character.dob.year, max: time.year-19, step: 1, onchange: 'prinston_core:character:info:dob:year' },
      { type: 'textdisplay', name: 'age', value: calculateAge() + ' y/o', prompt: 'Age (auto)' },
      { type: 'textdisplay', value: 'Continue', prompt: 'Next: Inheritance', onselect: 'prinston_core:character:openInheritanceMenu' }
    ],
    'prinston_core:character:openIntroMenu'
  );
});
