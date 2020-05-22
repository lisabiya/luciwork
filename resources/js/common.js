$(function(){
	// 获取屏幕高度
	let height = $(window).height();
	$(".main").height(height);
	
	// 登录
	$(".start .info .submit").on("click",function(){
		let userName = $(".type").val();
		let password = $(".address").val();
		let isHide = true;
		if((userName && password) != ''){
			window.location.href = "/router/index.html";
		}else{
			$(".start .info .tip").show();
			$(".start .info .submit").hide();
			$(".start .info .hide").show();
			setTimeout(()=>{
				$(".start .info .tip").hide();
				$(".start .info .submit").show();
				$(".start .info .hide").hide();
			},3000);
		}
	})
	
	// 选择区服节点
	$(".server .show-node").on("click",function(e){
		$(".server .slide").stop().slideToggle();
		e.stopPropagation();
	});
	
	$(".areas .show-node").on("click",function(e){
		$(".areas .slide").stop().slideToggle();
		e.stopPropagation();
	});
	
	$(".server .slide>span").on("click",function(){
		let text = $(this).text();
		$(".server .show-node").html(text);
		$(".server .slide").slideUp();
	})
	$(".areas .slide>span").on("click",function(){
		let text = $(this).text();
		$(".areas .show-node").html(text);
		$(".areas .slide").slideUp();
	})
	
	$(document).on("click",function(){
		$(".server .slide").slideUp();
		$(".areas .slide").slideUp();
	})
	
	// 选择加速设备
	$(".equs .item").one("click",function(){
		$(this).addClass("active").siblings().removeClass("active");
		// let index = $(this).index();
		// switch(index){
		// 	case 0:
		// 	break;
		// 	case 1:
		// 	break;
		// 	case 2:
		// 	break;
		// }
		$(".success-speedState").hide();
		$(".no-speedState").hide();
		$(".speedState").show();
		setTimeout(()=>{
			$(".speedState").hide();
			$(".success-speedState").show();
		},2500)
	})

	// 设置
	$(".toSet").on("click",function(){
		$(".speed").addClass("backOut");
		$(".set-inf").removeClass("backIn");
	})
	// 详情设置
	$(".info .item").on("click",function(){
		$(this).addClass("active").siblings().removeClass("active");
		$(".set-inf").addClass("backOut");
		$(".set-inf").removeClass("backDown");
		let ind = $(this).index();
		switch(ind){
			case 0:
			$(".wifi").removeClass("backIn");
			break;
			case 1:
			$(".s-game").removeClass("backIn");
			break
			case 2:
			$(".information").removeClass("backIn");
			break
			case 3:
			$(".reset").removeClass("backIn");
			break
			case 4:
			$(".restart").removeClass("backIn");
			break
			case 5:
			$(".update").removeClass("backIn");
			break
			case 6:
			$(".recovery").removeClass("backIn");
			break
			case 7:
			// 退出登录
			window.location.href = "/router/login.html";
			break
		}
	})
	// 返回设置界面
	$(".return-set").on("click",function(){
		$(".set-inf").removeClass("backOut");
		$(".s-game").addClass("backIn");
		$(".wifi").addClass("backIn");
		$(".information").addClass("backIn");
		$(".reset").addClass("backIn");
		$(".restart").addClass("backIn");
		$(".update").addClass("backIn");
		$(".recovery").addClass("backIn");
	});
	// 返回游戏加速页面
	$(".return-login").on("click",function(){
		$(".set-inf").addClass("backIn");
		$(".speed").removeClass("backOut");
	});
	// 重置密码
	$(".reset .set .submit").on("click",function(){
		let oldPassword = $(".reset .set .name>input").val();
		let newPassword = $(".reset .set .password>input").val();
		let lastPassword = $(".reset .set .sure>input").val();
		if((oldPassword && newPassword && lastPassword) != ''){
			$(".cover").show();
			$(".reset .set .tip").html("");
			setTimeout(()=>{
				$(".cover").hide();
				window.location.reload();
			},5000)
		}else if(oldPassword == ''){
			$(".reset .set .tip").html("<p>请输入旧密码</p>")
		}else if(newPassword == ''){
			$(".reset .set .tip").html("<p>请输入新密码</p>")
		}else if(lastPassword == ''){
			$(".reset .set .tip").html("<p>请再次输入新密码</p>")
		}
	});
	// 重新启动
	$(".restart .usual>a").on("click",function(){
		$(".cover").show();
		setTimeout(()=>{
			$(".cover").hide();
			window.location.reload();
		},5000)
	});
	// 恢复出厂设置
	$(".recovery .usual>a").on("click",function(){
		$(".cover").show();
		setTimeout(()=>{
			$(".cover").hide();
			window.location.reload();
		},5000)
	});
	// 游戏选择切换
	$(".igame").on("click",function(){
		let index = $(this).index();
		$(this).addClass("choice").siblings(".igame").removeClass("choice")
		$(".games").eq(index).show().siblings(".games").hide();
	})
	// 游戏
	let games = {
		all:["1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"],
		ps4:["2","2","2","2","2","2","2","2","2","2","2","2","2","2","2",],
		sw:["3","3","3","3","3","3","3","3","3","3","3","3","3","3","3","3","3","3"],
		xbox:["4","4","4","4","4","4","4","4","4","4","4","4","4","4","4","4"]
	};
	// 全部游戏
	let item = '';
	for(let list of games.all){
		item += `
			<div class="box">
				<img src="./img/logo.png" >
				<div class="right">
					<h2>${list}</h2>
					<p>Liu Xing</p>
				</div>
			</div>
		`
		$(".allgame").html(item);
	}
	// PS4
	let ps = '';
	for(let list of games.ps4){
		ps += `
			<div class="box">
				<img src="./img/logo.png" >
				<div class="right">
					<h2>${list}</h2>
					<p>Liu Xing</p>
				</div>
			</div>
		`
		$(".ps4").html(ps);
	}
	// switch
	let sw = '';
	for(let list of games.sw){
		sw += `
			<div class="box">
				<img src="./img/logo.png" >
				<div class="right">
					<h2>${list}</h2>
					<p>Liu Xing</p>
				</div>
			</div>
		`
		$(".switch").html(sw);
	}
	// xbox
	let xb = '';
	for(let list of games.xbox){
		xb += `
			<div class="box">
				<img src="./img/logo.png" >
				<div class="right">
					<h2>${list}</h2>
					<p>Liu Xing</p>
				</div>
			</div>
		`
		$(".xbox").html(xb);
	}
})