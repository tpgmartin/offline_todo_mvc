(function (window) {
  
  function Store (name, callback) {
    // callback = callback || function () {};
    // 
    // this._dbName = name;
    // 
    // // check we are not overwriting exisitng todos
    // var dbPromise = idb.open(this._dbName, 1, function (upgradeDb) {
    //   switch(upgradeDb.oldVersion) {
    //     case 0:
    //       upgradeDb.createObjectStore('todos', {keyPath: 'title'});
    //   }
    // });
    // 
    // dbPromise.then(function(db) {
    //   var tx = db.transaction('todos', 'readwrite');
    //   var todosStore = tx.objectStore('todos');
    // 
    //   todosStore.put({
    //     "title": "Take out trash",
    //     "completed": false,
    //     "id": 1463356992039
    //   });
    // 
    //   todosStore.put({
    //     "title": "Pet cat",
    //     "completed": false,
    //     "id": 1463357050974
    //   });
    // 
    //   todosStore.put({
    //     "title": "Take over world",
    //     "completed": false,
    //     "id": 1463357068790
    //   });
    // 
    //   return tx.complete;
    // }).then(function() {
    //   console.log('Todos added');
    // });
    // 
    // callback.call(this, JSON.parse(localStorage[name]));
  }
  
  Store.prototype.find = function (query, callback) {
    if (!callback) {
      return;
    }
    
    // var todos = JSON.parse(localStorage[this._dbName]).todos;
    // 
    // callback.call(this, todos.filter(function (todo) {
    //   for (var q in query) {
    //     if (query[q] !== todo[q]) {
    //       return false;
    //     }
    //   }
    //   return true;
    // }));
    
  };
  
  Store.prototype.findAll = function (callback) {
    // callback = callback || function () {};
    // callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
    
//     var index = db.transaction('wittrs')
//   .objectStore('wittrs').index('by-date');
// 
// return index.getAll().then(function(messages) {
//   indexController._postsView.addPosts(messages.reverse());
// });
//     
//     idb.open(this._dbName).then(function(db) {
//       var tx = db.transaction('todos');
//       var todosStore = tx.objectStore('todos');
//     
//       return todosStore.getAll();
//     }).then(function(todo) {
//       console.log('Todos:', todo);
//     });
  };
  
  Store.prototype.save = function (updateData, callback, id) {
    // var data = JSON.parse(localStorage[this._dbName]);
    // var todos = data.todos;
    // 
    // callback = callback || function () {};
    // 
    // if (id) {
    //   for (var i=0; i<todos.length; i++) {
    //     if (todos[i].id === id) {
    //       for (var key in updateData) {
    //         todos[i][key] = updateData[key];
    //       }
    //       break;
    //     }
    //   }
    //   
    //   localStorage[this._dbName] = JSON.stringify(data);
    //   callback(this, JSON.parse(localStorage[this._dbName]).todos);
    // } else {
    //   updateData.id = new Date().getTime();
    //   
    //   todos.push(updateData);
    //   localStorage[this._dbName] = JSON.stringify(data);
    //   callback.call(this, [updateData]);
    // }
    
  }
  
  Store.prototype.remove = function (id, callback) {
    // var data = JSON.parse(localStorage[this._dbName]);
    // var todos = data.todos;
    // 
    // for (var i=0; i<todos.length; i++) {
    //   if (todos[i].id == id){
    //     todos.splice(i, 1);
    //     break;
    //   }
    // }
    // 
    // localStorage[this._dbName] = JSON.stringify(data);
    // callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
  };
  
  Store.prototype.drop = function (callback) {
    // localStorage[this._dbName] = JSON.stringify({todos: []});
    // callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
  };
  
//   function databaseExists(name,callback){
//     var dbExists = true;
//     var request = window.indexedDB.open(name);
//     request.onupgradeneeded = function (e){
//         if(request.result.version===1){
//             dbExists = false;
//             window.indexedDB.deleteDatabase(name);
//             if(callback)
//                 callback(dbExists);
//         }
// 
//     };
//     request.onsuccess = function(e) {
//         if(dbExists){
//             if(callback)
//                 callback(dbExists);
//         }
//     };
// };


  
  window.app = window.app || {};
  window.app.Store = Store;
  
})(window);