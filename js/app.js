(function () {
  'use strict';
  
  function Todo (name) {
    // this.storage = new app.Store(name);
    // this.model = new app.Model(this.storage);
    this.template = new app.Template();
    this.view = new app.View(this.template);
    this.controller = new app.Controller(this.view);
  }
  
  var todo = new Todo('todos');
  
  function setView () {
    todo.controller.setView(document.location.hash);
  }

  $on(window, 'load', setView);
  $on(window, 'hashchange', setView);
  
  // register service worker
  if ('serviceWorker' in navigator) {
    console.log('Service Workers are supported');
    navigator.serviceWorker.register('./sw.js').then(function (res) {
      console.log('response', res);
    }).catch(function (err) {
      console.log(err);
    });
  }
})();