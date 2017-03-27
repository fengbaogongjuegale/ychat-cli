var reconntimes = 0;

// 连接服务端
function connect() {

	console.log("建立WS链接");

	// 创建websocket
	ws = new WebSocket("ws://" + "192.168.1.100" + ":7272");

	// 当socket连接打开时，输入用户名
	ws.onopen = onopen;
	// 当有消息时根据消息类型显示不同信息
	ws.onmessage = onmessage;
	ws.onclose = function() {

		console.log("连接关闭，定时重连");

		if(reconntimes < 5)
			setTimeout(connect(), 5000);
		else {
			console.log("已超过自动重连次数。")
		}
		connect();
	};
	ws.onerror = function() {
		console.log("出现错误");
	};
}

// 连接建立时发送登录信息
function onopen() {
	reconntimes = 0;

	//    var login_data = '{"type":"login","client_name":"'+name.replace("", '\\"')+'","room_id":"<?php echo isset($_GET['room_id']) ? $_GET['room_id'] : 1?>"}';
	//     var login_data ={};
	//     console.log("websocket握手成功，发送登录数据:"+login_data);

	var login_data = { "type": "login", "uid": localStorage.getItem('uid'), "token": localStorage.getItem('token') };
	console.log("onopen");
	ws.send(JSON.stringify(login_data));

}

// 服务端发来消息时
function onmessage(e) {
	console.log(e.data);
	var data = eval("(" + e.data + ")"); //强制表达式运算

	switch(data['type']) {
		case 'ping':
			ws.send('{"type":"pong"}');
			break;
		case 'searchuserinfo':
		
		if(!data['issuccess']){
			
			mui.fire(plus.webview.getWebviewById('input.html'),'err',{info:data['err']});
			
			break;
		}
		
		
		console.log(data);
		mui.fire(plus.webview.getWebviewById('person1.html'),'loaduserdata',{
			idwhyuser:data['idWhyUser'],
			nickname:data['nickname'],
			sex:data['sex']		
		});					
			mui.openWindow({				
				id: 'person1.html',
				preload: true,
				show: {
					aniShow: 'pop-in'
				},
				styles: {
					popGesture: 'hide'
				},
				waiting: {
					autoShow: false
				}
			});

			break;
			case 'makefri':
			
			mui.fire(plus.webview.getWebviewById('chatlist.html'),'makefri',{
				title:data['from'],
				content:data['verifycontent'],
				imgsrc:data['imgsrc']
			});
			
			
			
			break;
			case 'befrid':
			
			mui.fire(plus.webview.getWebviewById('chatlist.html'),'addli',{
				title:data['frisid'],
				content:'我们已经是好友拉，一起聊天吧！'
			});
			
			
			
			break;

		default:
			break;
	}

	//      var data = eval("("+e.data+")");//强制表达式运算
	//      switch(data['type']){
	//          // 服务端ping客户端
	//          case 'ping':
	//              ws.send('{"type":"pong"}');
	//              break;;
	//          // 登录 更新用户列表
	//          case 'login':
	//              //{"type":"login","client_id":xxx,"client_name":"xxx","client_list":"[...]","time":"xxx"}
	//              say(data['client_id'], data['client_name'],  data['client_name']+' 加入了聊天室', data['time']);
	//              if(data['client_list'])
	//              {
	//                  client_list = data['client_list'];
	//              }
	//              else
	//              {
	//                  client_list[data['client_id']] = data['client_name']; 
	//              }
	//              flush_client_list();
	//              console.log(data['client_name']+"登录成功");
	//              break;
	//          // 发言
	//          case 'say':
	//              //{"type":"say","from_client_id":xxx,"to_client_id":"all/client_id","content":"xxx","time":"xxx"}
	//              say(data['from_client_id'], data['from_client_name'], data['content'], data['time']);
	//              break;
	//          // 用户退出 更新用户列表
	//          case 'logout':
	//              //{"type":"logout","client_id":xxx,"time":"xxx"}
	//              say(data['from_client_id'], data['from_client_name'], data['from_client_name']+' 退出了', data['time']);
	//              delete client_list[data['from_client_id']];
	//              flush_client_list();
	//      }
}