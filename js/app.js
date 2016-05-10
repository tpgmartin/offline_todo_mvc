(function () {
  'use strict';
  
  function Todo (name) {
    this.template = new app.Template();
    this.view = new app.View(this.template);
  }
  
  var todo = new Todo('todos');
  
  function setView () {
    // todo.controller.setView(document.location.hash);
  }

  $on(window, 'load', setView);
  $on(window, 'hashchange', setView);
})();