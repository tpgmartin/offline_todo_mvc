(function (window) {
  
  function Store (name) {
    // If the browser doesn't support service worker,
    // we don't care about having a database
    if (!navigator.serviceWorker) {
      return Promise.resolve();
    }

    var dbPromise = idb.open('todos-db', 2, function(upgradeDb) {
      switch (upgradeDb.oldVersion) {
        case 0:
          upgradeDb.createObjectStore('todos', { keyPath: 'id' });
        case 1:
          var todosStore = upgradeDb.transaction.objectStore('todos');
          todosStore.createIndex('status', 'completed');
      }
    });
    
    return dbPromise;
  }

  window.app = window.app || {};
  window.app.Store = Store;

})(window);