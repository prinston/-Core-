function sendMax() {
  fetch(`https://${GetParentResourceName()}/getmax`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        height: $($('html').get(0)).outerHeight(true),
        width: $($('html').get(0)).outerWidth(true)
      })
  }).then(resp => { resp.json() }).then(resp => {});
}

window.addEventListener('message', (event) => {
  switch(event.data.type.toLowerCase()){
    case 'inject':
      $($('body').get(0)).append($(event.data.source));
      break;
    case 'run':
      eval(event.data.source);
      break;
  }
});

sendMax();
