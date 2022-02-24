let economySVGPaths = {
  color: 'white',
  viewBox: '0 0 100 100',
  paths: [
    'M 45 0 h 10 v 100 h -10 z',
    'M 50 5 c -50 0 -50 25 -50 25 c 0 25 50 25 50 25 c 40 0 40 15 40 15 c 0 15 -40 15 -40 15 c -40 0 -40 -15 -40 -15 h -10 c 0 25 50 25 50 25 c 50 0 50 -25 50 -25 c 0 -25 -50 -25 -50 -25 c -40 0 -40 -15 -40 -15 c 0 -15 40 -15 40-15 c 40 0 40 15 40 15 h 10 c 0 -25 -50 -25 -50 -25 z'
  ]
}

function hasEnoughMoney(amount) {
  amount = parseFloat(parseFloat(amount + '').toFixed(2));
  if(character != undefined) return parseFloat((character.cash + character.bank * 1.0).toFixed(2)) >= amount;
  return false;
}

function hasEnoughCash(amount) {
  amount = parseFloat(parseFloat(amount + '').toFixed(2));
  if(character != undefined) return parseFloat((character.cash * 1.0).toFixed(2)) >= amount;
  return false;
}

function hasEnoughBank(amount) {
  amount = parseFloat(parseFloat(amount + '').toFixed(2));
  if(character != undefined) return parseFloat((character.bank * 1.0).toFixed(2)) >= amount;
  return false;
}

onNet('prinston_core:transaction', (made, amount, reason) => {
  if(made) {
    if(amount < -0) amount *= -1;
    let tAmount = amount;
    if(character.cash < amount) {
      amount -= character.cash;
      character.cash = 0;
    } else {
      character.cash -= amount;
      amount = 0;
    }
    character.bank -= amount;
    uploadInfo();
    economySVGPaths.color = 'green';
    createNotification({ icon: economySVGPaths, title: { text: 'You made a payment of ' + formatMoney(tAmount), style: 'color:GREEN;' }, subtitle: { text: reason, style: 'color:GREEN' }});
  } else {
    economySVGPaths.color = 'red';
    createNotification({ icon: economySVGPaths, title: { text: 'Transaction of ' + formatMoney(amount) + ' failed', style: 'color:RED;' }, subtitle: { text: 'Insufficient funds on person and in bank account', style: 'color:RED' }});
  }
});

onNet('prinston_core:transactionCash', (made, amount, reason) => {
  if(made) {
    if(amount < -0) amount *= -1;
    character.cash -= amount;
    uploadInfo();
    economySVGPaths.color = 'green';
    createNotification({ icon: economySVGPaths, title: { text: 'You made a payment of ' + formatMoney(amount), style: 'color:GREEN;' }, subtitle: { text: reason, style: 'color:GREEN' }});
  } else {
    economySVGPaths.color = 'red';
    createNotification({ icon: economySVGPaths, title: { text: 'Transaction of ' + formatMoney(amount) + ' failed', style: 'color:RED;' }, subtitle: { text: 'Insufficient funds on person', style: 'color:RED' }});
  }
});

onNet('prinston_core:transactionBank', (made, amount, reason) => {
  if(made) {
    if(amount < -0) amount *= -1;
    character.bank -= amount;
    uploadInfo();
    economySVGPaths.color = 'green';
    createNotification({ icon: economySVGPaths, title: { text: 'You made a payment of ' + formatMoney(amount), style: 'color:GREEN;' }, subtitle: { text: reason, style: 'color:GREEN' }});
  } else {
    economySVGPaths.color = 'red';
    createNotification({ icon: economySVGPaths, title: { text: 'Transaction of ' + formatMoney(amount) + ' failed', style: 'color:RED;' }, subtitle: { text: 'Insufficient funds in bank account', style: 'color:RED' }});
  }
});

onNet('prinston_core:payment', (made, amount, reason) => {
  if(made) {
    character.cash += amount;
    uploadInfo();
    economySVGPaths.color = 'green';
    createNotification({ icon: economySVGPaths, title: { text: formatMoney(amount) + ' Payment Received', style: 'color:GREEN;' }, subtitle: { text: reason, style: 'color:GREEN' }});
  }
});

function chargePlayer(amount, reason = 'UNKOWN SOURCE OF TRANSACTION', callback = undefined) {
  amount = parseFloat(parseFloat(amount + '').toFixed(2));
  if(amount < 0) {
    if(callback != undefined) callback(false);
    return;
  }
  if(hasEnoughMoney(amount)) {
    emitNet('mysql:createTransaction', character, -1 * amount, reason, 'prinston_core:transaction');
  }
}

function chargePlayerCash(amount, reason = 'UNKOWN SOURCE OF TRANSACTION', callback = undefined) {
  amount = parseFloat(parseFloat(amount + '').toFixed(2));
  if(amount < 0) {
    if(callback != undefined) callback(false);
    return;
  }
  if(hasEnoughCash(amount)) {
    emitNet('mysql:createTransaction', character, -1 * amount, reason, 'prinston_core:transactionCash');
  }
}

function chargePlayerBank(amount, reason = 'UNKOWN SOURCE OF TRANSACTION', callback = undefined) {
  amount = parseFloat(parseFloat(amount + '').toFixed(2));
  if(amount < 0) {
    if(callback != undefined) callback(false);
    return;
  }
  if(hasEnoughBank(amount)) {
    emitNet('mysql:createTransaction', character, -1 * amount, reason, 'prinston_core:transactionBank');
  }
}

function payPlayerCash(amount, reason = 'UNKOWN SOURCE OF TRANSACTION', callback = undefined) {
  amount = parseFloat(parseFloat(amount + '').toFixed(2));
  if(amount < 0) {
    if(callback != undefined) callback(false);
    return;
  }
  emitNet('mysql:createTransaction', character, amount, reason, 'prinston_core:payment');
}

function payPlayerBank(amount, reason = 'UNKOWN SOURCE OF TRANSACTION', callback = undefined) {
  amount = parseFloat(parseFloat(amount + '').toFixed(2));
  if(amount < 0) {
    if(callback != undefined) callback(false);
    return;
  }
  emitNet('mysql:createTransaction', character, amount, reason, 'prinston_core:payment');
}

exports('chargePlayer', chargePlayer);
exports('chargePlayerCash', chargePlayerCash);
exports('chargePlayerBank', chargePlayerBank);
onNet('prinston_core:chargePlayer', chargePlayer);
onNet('prinston_core:chargePlayerCash', chargePlayerCash);
onNet('prinston_core:chargePlayerBank', chargePlayerBank);
exports('payPlayerCash', payPlayerCash);
exports('payPlayerBank', payPlayerBank);
onNet('prinston_core:payPlayerCash', payPlayerCash);
onNet('prinston_core:payPlayerBank', payPlayerBank);
