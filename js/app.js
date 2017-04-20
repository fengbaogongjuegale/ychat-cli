/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		console.log('login..............................................');
//		ws = new WebSocket("ws://"+"192.168.1.100"+":7272");
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		
		//		if(loginInfo.account.length < 5) {
		//			return callback('账号最短为 5 个字符');
		//		}
		//		if(loginInfo.password.length < 6) {
		//			return callback('密码最短为 6 个字符');
		//		}
		
		return callback();/////////////////////////
		
//		var issuccess;
console.log('sss');
		mui.post('http://192.168.1.100/ychat/ychat-server/index.php/W/li', loginInfo, function(data) {
			console.log("dddd");
			console.log(JSON.stringify(data));
			console.log(JSON.stringify(data['0']['idWhyUser']));
			console.log(data.success);
			console.log(data['0']['idWhyUser']);
			
			if(data.success) {
				
				localStorage.setItem('token',data.token);
				localStorage.setItem('uid',data['0']['idWhyUser']);
				
				return owner.createState(loginInfo.account, callback);
			} else {
				console.log("hhhhhh")
				return callback('用户名或密码错误');
			}
			//			alert('ha?');

		}, 'json');
		//		alert('ha?hh');

		//		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		//		var authed = users.some(function(user) {
		//			return loginInfo.account == user.account && loginInfo.password == user.password;
		//		});

	};

	owner.createState = function(name, callback) {
		var state = owner.getState();
		state.account = name;
		state.token = "token123456789";
		owner.setState(state);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop; //var attr = attr || “”;这个运算经常用来判断一个变量是否已定义，如果没有定义就给他一个初始值，这在给函数的参数定义一个默认值的时候比较有用。因为js不像php可以直接在型参数上定义func($attr=5)。再次提醒你记住上面的原则：如果实参需要是0、""、null、false、undefined、NaN的时候也会当false来处理。
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		//		if(regInfo.account.length < 5) {
		//			return callback('用户名最短需要 5 个字符');
		//		}
		//		if(regInfo.password.length < 6) {
		//			return callback('密码最短需要 6 个字符');
		//		}
		//		if(!checkEmail(regInfo.email)) {
		//			return callback('邮箱地址不合法');
		//		}

		/*
		 * 这里改成向服务器发送
		 */
		//要有'http://'、
		console.log('lo');
		mui.post('http://192.168.1.100/ychat/ychat-server/index.php/W/lo', regInfo, function(data) {
			//							console.log(data);
			console.log(JSON.stringify(data));
			//			alert('ha?');
		}, 'json');

		//		var users = JSON.parse(localStorage.getItem('$users') || '[]'); //为空则设置值（就是之前没有）
		//		users.push(regInfo);
		//		localStorage.setItem('$users', JSON.stringify(users));
		
		return callback();
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
		
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

	var checkEmail = function(email) {
		email = email || '';
		return(email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if(!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
			var settingsText = localStorage.getItem('$settings') || "{}";
			return JSON.parse(settingsText);
		}
		/**
		 * 获取本地是否安装客户端
		 **/
	owner.isInstalled = function(id) {
		if(id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if(mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch(e) {}
		} else {
			switch(id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
}(mui, window.app = {}));