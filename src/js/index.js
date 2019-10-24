function getdate() {
	const dt = new Date();
	const y = dt.getFullYear();
	const m = dt.getMonth() + 1;
	const d = dt.getDate();
	const hh = dt.getHours().toString().padStart(2, 0);
	const mm = dt.getMinutes().toString().padStart(2, 0);
	const ss = dt.getSeconds().toString().padStart(2, 0);
	const time = y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
	return time;
}
let addr;
for (let i = 1; i <= 69; i++) {
	addr = `images/emoji/${i}.gif`;
	let li = `<li class="emojiImgM"><img src="${addr} "alt="" class="liImg"></li>`
	$('.emoji').append($(li))
}
function toBottom(){
	let middleHeight=$('.middle').height()
	let ul=document.getElementsByClassName('ul')[0]
	console.log(middleHeight,ul.scrollHeight)
	if(ul.scrollHeight>middleHeight){
		$('.middle').scrollTop(ul.scrollHeight-middleHeight)
	}
}
$('#login').click(function(e) {
	e.stopPropagation();
	let username = $('.userName').val().trim();
	let sendCont;
	if (!username) {
		return
	}
	// 建立socket连接
	let socket = io.connect('localhost:8088');
	socket.on('connect', () => {
		socket.emit('login', username);
	})
	
	$('.xinxin').click(function(e) {
		e.stopPropagation()
		$(".emoji").slideToggle();
	})
	$('body').click(function(e) {
		e.stopPropagation()
		$(".emoji").hide();
	})

	$('ul.emoji').on('click', 'img', function(e) {
		e.stopPropagation()
		socket.emit('imgMsg', e.target.currentSrc)
		console.log(e, 2222)
		$(".emoji").hide();
	})

	// 用户名存在
	socket.on('nickname', () => {
		$('.tips').fadeIn().delay(2000).fadeOut()
	})
	// 登陆成功
	socket.on('loginSuccess', () => {
		$('.mask').hide();
		$('.chatwindow').show();
		let middleHeight = $('.chatwindow').height() - $('.bottom').height() - $('.top').height()
		$('.middle').css({
			"height": middleHeight + 'px',
			"overflow": "hidden",
			"overflow-y": "auto"
		})
		// 发送文字消息
		$('.send').click(function() {
			sendCont = $('.sendContent').val();
			if (!sendCont) {
				$('.alertBox').fadeIn().delay(1000).fadeOut();
				return;
			}
			socket.emit('msg', sendCont)
			$('.sendContent').val('')
		})
		// 发送本地图片
		$('.uploadPic').click(function() {
			$('#upload').click();
			$('#upload').change(function(e) {
				var file = this.files[0];
				// 确认选择的文件是图片                
				if (file.type.indexOf("image") == 0) {
					var reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = function(e) {
						// 图片base64化
						var newUrl = this.result;
						// let li = `<li>
						// 			<img src="${newUrl}" alt="" class="liImg">
						// 		</li>`
						// $('.ul').append($(li))

						socket.emit('mySelfImg', newUrl);
					};
				}
			});

		})
	})
	// 系统广播 用户、人数、上/下线
	socket.on('system', (username, num, operation) => {
		console.log(username, num, operation)
		$('.onLineNum').text(num);
		let time = getdate();
		let opt;
		if (operation == "login") {
			opt = "上线"
		} else if (operation == "logout") {
			opt = "下线"
		}
		let li = `<li class="announce">
					${username} 在${time} ${opt}
				</li>`
		$('.ul').append($(li))
	})
	// 系统广播发送消息
	socket.on('newMsg', (Tusername, sendCont) => {
		console.log(Tusername, sendCont);
		if (username == Tusername) {
			let li =
				`<li>
						<div class="liNameL">${Tusername}:</div>
						<div class="liCont">${sendCont}</div>
					</li>`
			$('.ul').append($(li))
		} else {
			let li =
				`<li class="liR">
						<div>:${Tusername}</div>
						<div class="liContR">${sendCont}</div>
					</li>`
			$('.ul').append($(li))
		}
	})
	// 本地图片
	socket.on('mySelfImg', (name, addr) => {
		if (username == name) {
			let li =
				`<li>
						<div class="liNameL">${name}:</div>
						<div class="liCont"><img src="${addr}" alt="" class="liImg"></div>
					</li>`
			$('.ul').append($(li))
		} else {
			let li =
				`<li class="liR">
						<div>:${name}</div>
						<div class="liContR"><img src="${addr}" alt="" class="liImg"></div>
					</li>`
			$('.ul').append($(li))
		}

	})
	// 表情
	socket.on('newImg', (name, addr) => {
		console.log(name, addr)
		if (username == name) {
			let li =
				`<li>
						<div class="liNameL">${name}:</div>
						<div class="liCont"><img src="${addr}" alt="" class="liImg"></div>
					</li>`
			$('.ul').append($(li))
		} else {
			let li =
				`<li class="liR">
						<div>:${name}</div>
						<div class="liContR"><img src="${addr}" alt="" class="liImg"></div>
					</li>`
			$('.ul').append($(li))
		}
		toBottom()

	})

})
