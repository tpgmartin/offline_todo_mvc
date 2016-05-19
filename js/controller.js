(function (window) {
	'use strict';
	
	function openDatabase() {
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

		dbPromise.then(function(db) {
		  var tx = db.transaction('todos', 'readwrite');
		  var todosStore = tx.objectStore('todos');
		
		  todosStore.put({
		    "title": "Take out trash",
		    "completed": 1,
		    "id": 1463356992039
		  });
		
		  todosStore.put({
		    "title": "Pet cat",
		    "completed": 0,
		    "id": 1463357050974
		  });
		
		  todosStore.put({
		    "title": "Take over world",
		    "completed": 0,
		    "id": 1463357068790
		  });
		
		  return tx.complete;
		})
		
		return dbPromise;
	}

	function Controller(view) {
		var self = this;
		self.view = view;
		self._dbPromise = openDatabase();

		self.view.bind('newTodo', function (title) {
			self.addItem(title);
		});

		self.view.bind('itemEdit', function (item) {
			self.editItem(item.id);
		});

		self.view.bind('itemEditDone', function (item) {
			self.editItemSave(item.id, item.title);
		});

		self.view.bind('itemEditCancel', function (item) {
			self.editItemCancel(item.id);
		});

		self.view.bind('itemRemove', function (item) {
			self.removeItem(item.id);
		});

		self.view.bind('itemToggle', function (item) {
			self.toggleComplete(item.id, item.completed);
		});

		self.view.bind('removeCompleted', function () {
			self.removeCompletedItems();
		});

		self.view.bind('toggleAll', function (status) {
			self.toggleAll(status.completed);
		});
	}

	Controller.prototype.setView = function (locationHash) {
		var route = locationHash.split('/')[1];
		var page = route || '';
		this._updateFilterState(page);
	};

	Controller.prototype.showAll = function () {
		var self = this;
		
		return self._dbPromise.then(function (db) {
			
			var index = db.transaction('todos')
					.objectStore('todos');
					
			return index.getAll().then(function (data) {
					self.view.render('showEntries', data);
			});
		});	
	};

	Controller.prototype.showActive = function () {
		var self = this;
		
		return self._dbPromise.then(function (db) {
			
			var index = db.transaction('todos')
					.objectStore('todos');

			return index.getAll().then(function (data) {
					var active = data.filter(function (todo) {
						return todo.completed === false;
					});
					self.view.render('showEntries', active);
			});
		});	

	};

	Controller.prototype.showCompleted = function () {
		var self = this;

		return self._dbPromise.then(function (db) {
			
			var index = db.transaction('todos')
					.objectStore('todos');

			return index.getAll().then(function (data) {
					var completed = data.filter(function (todo) {
						return todo.completed === true;
					});
					self.view.render('showEntries', completed);
			});
		});	

	};

	Controller.prototype.addItem = function (title) {
		var self = this;

		if (title.trim() === '') {
			return;
		}

		return self._dbPromise.then(function (db) {
	
			var index = db.transaction('todos', 'readwrite')
				.objectStore('todos');
			
			var newId = new Date().getTime();
			var newTodo = {
				'completed': false,
				'id': newId,
				'title': title
			};
			
			var request = index.put(newTodo);
			
			self.view.render('clearNewTodo');
			self._filter(true);

			// request.onsuccess = function(){
			// 	self.view.render('clearNewTodo');
			// 	self._filter(true);
			// };
			// request.onerror = function(e){
			// 		console.log('Error adding: '+e);
			// };

		});
	};

	Controller.prototype.editItem = function (id) {
		var self = this;
		
		return self._dbPromise.then(function (db) {
	
			var index = db.transaction('todos', 'readwrite')
				.objectStore('todos');
			var request = index.get(id);

			request.then(function(todo){
				
				console.log('..........');
				console.log(todo);
				
				self.view.render('editItem', {id: id, title: todo.title});
			});

		});

	};

	Controller.prototype.editItemSave = function (id, title) {
		var self = this;
		
		console.log('title');
		console.log(title);
		
		title = title.trim();
		
		return self._dbPromise.then(function (db) {
	
			var index = db.transaction('todos', 'readwrite')
				.objectStore('todos');
				
			if (title.length !== 0) {
				return index.get(id).then(function (todo) {
					console.log(todo);
					self.view.render('editItemDone', {id: id, title: todo.title});
				});
			} else {
				self.removeItem(id);
			}

		});

	};

	Controller.prototype.editItemCancel = function (id) {
		var self = this;
		// self.model.read(id, function (data) {
		// 	self.view.render('editItemDone', {id: id, title: data[0].title});
		// });
	};

	Controller.prototype.removeItem = function (id) {
		var self = this;
		
		return self._dbPromise.then(function (db) {
	
			var index = db.transaction('todos', 'readwrite')
				.objectStore('todos');
			var request = index.delete(id);
			
			request.then(function () {
				self.view.render('removeItem', id);
			}).catch(function (err) { console.log (err) });

		});
	};

	Controller.prototype.removeCompletedItems = function () {
		var self = this;
		
		return self._dbPromise.then(function (db) {
	
			var index = db.transaction('todos', 'readwrite')
				.objectStore('todos');
			
			return index.getAll().then(function (data) {
				data.forEach(function (todo) {
					if (todo.completed) self.removeItem(todo.id);
				});
			});

		});

	};

	Controller.prototype.toggleComplete = function (id, completed, silent) {
		var self = this;

		// if (!silent) {
		// 	self._filter();
		// }
		
		return self._dbPromise.then(function (db) {
	
			var index = db.transaction('todos', 'readwrite')
				.objectStore('todos');

			index.get(id).then(function (todo) {
				todo.completed = !todo.completed;
				index.put(todo);
				self.view.render('elementComplete', {
					id: todo.id,
					completed: todo.completed
				});
			});
		});
		
	};

	Controller.prototype.toggleAll = function (completed) {
		var self = this;
		
		return self._dbPromise.then(function (db) {
	
			var index = db.transaction('todos', 'readwrite')
				.objectStore('todos');
			
			return index.getAll().then(function (data) {
				data.forEach(function (todo) {
					if (todo.completed !== completed) self.toggleComplete(todo.id, completed, true);
				});
			});

		});
	};

	Controller.prototype._updateCount = function () {
		var self = this;
		
		return self._dbPromise.then(function (db) {
	
			var index = db.transaction('todos')
				.objectStore('todos');
				
			return index.getAll();
			
		}).then(function(todos) {
			var totalCount = todos.length;
			var activeCount = todos.filter(function (todo) {
				return todo.completed === 0;
			}, 0).length;
			var completedCount = todos.length - activeCount; 
			
			self.view.render('updateElementCount', activeCount);
			self.view.render('clearCompletedButton', {
				completed: completedCount,
				visible: completedCount > 0
			});
			
			self.view.render('toggleAll', {checked: completedCount === totalCount});
			self.view.render('contentBlockVisibility', {visible: totalCount > 0});
		});

	};

	Controller.prototype._filter = function (force) {
		var activeRoute = this._activeRoute.charAt(0).toUpperCase() + this._activeRoute.substr(1);

		this._updateCount();

		if (force || this._lastActiveRoute !== 'All' || this._lastActiveRoute !== activeRoute) {
			this['show' + activeRoute]();
		}

		this._lastActiveRoute = activeRoute;
	};

	Controller.prototype._updateFilterState = function (currentPage) {

		this._activeRoute = currentPage;

		if (currentPage === '') {
			this._activeRoute = 'All';
		}

		this._filter();

		this.view.render('setFilter', currentPage);
	};

	window.app = window.app || {};
	window.app.Controller = Controller;
})(window);