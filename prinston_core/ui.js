let openMenus = [];
let activeMenu = '';

function sendEvent(eventName, data) {
  fetch(`https://${GetParentResourceName()}/` + eventName, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data)
  }).then(resp => { resp.json() }).then(resp => {});
}

function beginFade(notif) {
  let opacity = 1.0;
  let inter = setInterval(() => {
    opacity -= 0.01;
    notif.css('opacity', opacity);
    if(opacity <= 0) {
      opacity = 0;
      notif.remove();
      clearInterval(inter);
    }
  }, 1);
}

window.addEventListener('message', (event) => {
  switch(event.data.type.toLowerCase()) {
    case 'notification':
      let notification = $('<div>');
      if(event.data.icon != undefined) {
        let color = 'WHITE';
        let svg = '<svg';
        if(event.data.icon.viewBox != undefined) svg += ' viewBox=\'' + event.data.icon.viewBox + '\'';
        else svg += ' viewBox=\'0 0 100 100\'';
        if(event.data.icon.color != undefined) color = event.data.icon.color;
        svg += ' fill=\'' + color + '\'';
        svg += '>';
        if(event.data.icon.paths != undefined) {
          for(let pathIndex in event.data.icon.paths) {
            svg += '<path d=\'' + event.data.icon.paths[pathIndex] + '\' fill=\'' + color + '\' />';
          }
        }
        notification.append($(svg));
      }
      let title = $('<p>');
      title.attr('class', 'title');
      if(event.data.title != undefined) {
        title.text(event.data.title.text != undefined?event.data.title.text:'-');
        if(event.data.title.style != undefined) {
          title.attr('style', event.data.title.style);
        }
      }
      let subtitle = $('<p>');
      subtitle.attr('class', 'subtitle');
      if(event.data.subtitle != undefined) {
        subtitle.text(event.data.subtitle.text != undefined?event.data.subtitle.text:'-');
        if(event.data.subtitle.style != undefined) {
          subtitle.attr('style', event.data.subtitle.style);
        }
      }

      notification.append(title);
      notification.append(subtitle);
      $('#notifications').prepend(notification);

      setTimeout(() => {
        beginFade(notification);
      }, event.data.fadeTime != undefined?event.data.fadeTime * 1000:3000);
      break;
  }
});
