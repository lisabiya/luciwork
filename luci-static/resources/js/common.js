$(function(){
	// 获取屏幕高度
	let height = $(window).height();
	$(".main").height(height);
	
	// 登录
	$(".submit").on("click",function(){
		let userName = $(".type").val();
		let password = $(".address").val();
		if((userName && password) != ''){
			$(".start").hide();
			$(".speed").removeClass("backIn");
			$(".user").html(userName);
		}else{
			console.log("请输入账号密码")
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
	})
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