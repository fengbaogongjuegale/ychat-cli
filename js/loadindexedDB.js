var iDB = (function() {

	var _db;
	/**
	 * 数据库初始化，用户登陆后调用
	 * @param {Object} DB_NAME 数据库名区分用户 格式 iDB_[n],n为用户id
	 * @param {Object} DB_VERSION 数据库版本
	 */
	
	function _initDb(DB_NAME, DB_VERSION) {
		var req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onsuccess = function(evt) {
			_db = evt.target.result;
			console.debug("initDb DONE");
		};
		req.onerror = function(evt) {
			console.error("initDb:", evt.target.errorCode);
		};
		req.onupgradeneeded = function(evt) {
			console.debug("initDb.onupgradeneeded");
			var db = evt.currentTarget.result;
			//个人信息
			//			var personInfoStore ;
			//聊天记录
			var chatLogStore = db.createObjectStore('chatlog', { autoIncrement: true });
			chatLogStore.createIndex('source', 'source', { unique: false }); //建索引
			//朋友圈
			var circleLogStore = db.createObjectStore('circlelog', { autoIncrement: true });
			//联系人列表
			var contactListStore = db.createObjectStore('contactlist', { autoIncrement: true });
			//退出登陆前的聊天列表
			var chatListStore = db.createObjectStore('chatlist', { autoIncrement: true });
		};

	};

	/**
	 * 获取某个souece的聊天记录。返回数组。打开聊天页面是调用。	
	 * @param {Object} key 
	 * @param {Object} success_callback
	 */
	function getChatLog(key, success_callback) {
		var tx = _db.transaction('chatlog', 'readonly');
		var store = tx.objectStore('chatlog');
		var index = store.index("source");
		var request = index.openCursor(IDBKeyRange.only(key));

		var clogs = [];

		request.onsuccess = function(e) {
			var cursor = e.target.result;
			if(cursor) {
				var log = cursor.value;
				clogs.push(log);
				//                  console.log(student.name);
				cursor.continue();
			} else {
				success_callback(clogs);
			}
		}
	}

	/**
	 * 用户登陆后加载聊天列表
	 * @param {Object} success_callback
	 */
	function getChatList(success_callback) {
		var tx = _db.transaction('chatlist', 'readonly');
		var store = tx.objectStore('chatlist');
		var logs = [];
		store.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;
			if(cursor) {
				logs.push(cursor.value);
				cursor.continue();
			} else {
				success_callback(logs);
			}
		}
	}

	/**
	 * 用戶退出登陸后保存聊天列表信息。
	 * @param {Object} cl
	 * @param {Object} complete_callback
	 */
	function saveChatList(cl,complete_callback) {
		var transaction = db.transaction('chatlist', 'readwrite');
		var store = transaction.objectStore('chatlist');
		store.clear();
		// 当所有的数据都被增加到数据库时执行一些操作
		transaction.oncomplete = complete_callback;

		transaction.onerror = function(event) {
			  console.error("error:", event.target.errorCode);
		};
		for(var i in cl) {
			store.add(cl[i]);
		}
	}
	
	/**
	 *获取联系人列表 
	 */
	function getContactList(){
		
	}
	

	return {
		initDb: _initDb,
		db: _db
	};
})();