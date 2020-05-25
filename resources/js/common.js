$(function () {
    var qrurl = "http://log.321274.com/box/account/";
    var verUrl = "http://api.liuxing.321174.com/box/route/version/";
    var timer = '';
    var version = '';
    var data = {};
    var infor = JSON.parse(localStorage.getItem('userInfor'));

    // 获取屏幕高度
    let height = $(window).height();
    $(".main").height(height);

    // 获取设备版本
    function getVersion() {
        XHR.get(baseurl + 'upgrade', {version: 1},
            function (x, info) {
                console.log(info);
                if (info == null) {
                    alert("页面已过期");
                    window.location.reload();
                }
                version = info.data.version;
                $(".oldVersion").html(version);
            });
        $.ajax({
            url: verUrl + '',
            dataType: 'json',
            type: 'POST',
            data: {
                "version": version
            },
            beforeSend() {
                $(".onloading").show()
            },
            success(res) {
                console.log(res)
                $(".onloading").hide()
                if (res.code == 1) {
                    $(".isUpdate").show();
                    $(".noUpdate").hide();
                    $(".newVersion").html(res.data.version);
                } else if (res.code == 2) {
                    $(".isUpdate").hide();
                    $(".noUpdate").show();
                    $(".newVersion").html(version);
                }
            },
            error(err) {
                console.log(err)
            }
        })
    }

    // // 点击更新
    // $(".isUpdate").on("click",function(){
    // 	// 请求下载接口
    // 	let status = false;
    // 	let msg = "提示提示提示提示提示提示提示提示提示提示提示提示提示提示提示提示提示提示";
    // 	$(".updata-box").show();
    // 	$(".updata-box>p").html(msg)
    // 	if(!status){
    // 		$(".makeSure").hide();
    // 	}
    // });
    // $(".cancel").on("click",function(){
    // 	$(".updata-box").hide();
    // })

    // 用户登录
    $(".speed .user").on("click", function (e) {
        e.stopPropagation();
        $.ajax({
            url: qrurl + 'get_qr_code',
            dataType: 'json',
            type: 'POST',
            beforeSend() {
                $(".onloading").show();
            },
            success(res) {
                $(".login-wechat").addClass("slideUp");
                $(".login-wechat").removeClass("slideDown");
                $(".onloading").hide();
                $(".login-wechat>img").attr("src", res.data.url);
                timer = setInterval(() => {
                    isCheck(res.data.ticket);
                }, 1000)
            },
            error(err) {
                console.log(err)
            }
        })
    })

    $(".login-wechat").on("click", function () {
        $(this).removeClass("slideUp");
        $(this).addClass("slideDown");
    })

    // 检测用户是否登录
    function isCheck(ticket) {
        $.ajax({
            url: qrurl + 'check_login',
            dataType: 'json',
            type: 'POST',
            data: {
                "ticket": ticket
            },
            success(res) {
                if (res.code == 0) {
                    data = res.data.info;
                    localStorage.setItem('userInfor', JSON.stringify(data));
                    clearInterval(timer);
                    $(".login-wechat").removeClass("slideUp");
                    $(".login-wechat").addClass("slideDown");
                    $(".speed .login").hide();
                    $(".speed .user").show();
                    $(".speed .user").html(data.nick_name);
                }
            },
            error(err) {
                console.log(err)
            }
        })
    }

    if (infor != null) {
        $(".speed .login").hide();
        $(".speed .user").show();
        $(".speed .user").html(infor.nick_name);
    }

    // // 设备登录
    // $(".start .info .submit").on("click",function(){
    // 	let userName = $(".type").val();
    // 	let password = $(".address").val();
    // 	let isHide = true;
    // 	if((userName && password) != ''){
    // 		window.location.href = "/router/index.html";
    // 	}else{
    // 		$(".start .info .tip").show();
    // 		$(".start .info .submit").hide();
    // 		$(".start .info .hide").show();
    // 		setTimeout(()=>{
    // 			$(".start .info .tip").hide();
    // 			$(".start .info .submit").show();
    //
    // 		},3000);
    // 	}
    // })

    // 选择区服节点
    $(".server .show-node").on("click", function (e) {
        $(".server .slide").stop().slideToggle();
        e.stopPropagation();
    });

    $(".areas .show-node").on("click", function (e) {
        $(".areas .slide").stop().slideToggle();
        e.stopPropagation();
    });

    $(document).on("click", function () {
        $(".server .slide").slideUp();
        $(".areas .slide").slideUp();
    })


    // 设置
    $(".toSet").on("click", function () {
        $(".speed").addClass("backOut");
        $(".set-inf").removeClass("backIn");
    })
    // 详情设置
    $(".info .item").on("click", function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".set-inf").addClass("backOut");
        $(".set-inf").removeClass("backDown");
        let ind = $(this).index();
        switch (ind) {
            case 0:
                $(".wifi").removeClass("backIn");
                XHR.get(baseurl + 'wifiset', null,
                    function (x, info) {
                        console.log(info);
                        if (info == null) {
                            alert("页面已过期");
                            window.location.reload();
                        }
                        $("input[name='name']").val(info.data.name);
                        $("input[name='password']").val(info.data.pswd);
                    });
                break;
            case 1:
                $(".s-game").removeClass("backIn");
                break
            case 2:
                $(".information").removeClass("backIn");
                XHR.get(baseurl + 'devinfo', null,
                    function (x, info) {
                        console.log(info);
                        if (info == null) {
                            alert("页面已过期");
                            window.location.reload();
                        }
                        let items = $(".information .contain p span");
                        $(items[0]).text(info.msg.hostname);
                        $(items[1]).text(info.msg.model);
                        $(items[2]).text(info.msg.version);
                        $(items[3]).text(info.msg.macaddr);
                        $(items[4]).text(info.msg.ipaddr);
                        $(items[5]).text(formatSeconds(info.msg.uptime));
                    });
                break
            case 3:
                $(".reset").removeClass("backIn");
                break
            case 4:
                $(".restart").removeClass("backIn");
                break
            case 5:
                $(".update").removeClass("backIn");
                getVersion();
                break
            case 6:
                $(".recovery").removeClass("backIn");
                break
            case 7:
                // 退出登录
                localStorage.clear();
                window.location.href = baseurl.replace("home", "logout");
                break
        }
    })
    // 返回设置界面
    $(".return-set").on("click", function () {
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
    $(".return-login").on("click", function () {
        $(".set-inf").addClass("backIn");
        $(".speed").removeClass("backOut");
    });
    //设置wifi
    $(".wifi .set .subimt").on("click", function () {
        let name = $(".wifi .set .name>input").val();
        let password = $(".wifi .set .password>input").val();
        console.log(name !== '' && password.length > 7)
        if (name !== '' && password.length > 7) {
            $(".cover").show();
            XHR.get(baseurl + 'wifiset', {ssid: name, pswd: password},
                function (x, info) {
                    console.log(info);
                    $(".cover").hide();
                    if (info == null) {
                        alert("页面已过期");
                        window.location.reload();
                    }
                    if (info.msg === "success") {
                        $(".wifi .set .tip").html("<p>修改成功</p>");
                    } else {
                        $(".wifi .set .tip").html("<p>" + info.msg + "</p>");
                    }
                })
        } else if (name === '') {
            $(".wifi .set .tip").html("<p>WiFi名不能为空</p>")
        } else if (password.length < 8) {
            $(".wifi .set .tip").html("<p>密码必须大于8位</p>")
        }
    });

    // 重置密码
    $(".reset .set .submit").on("click", function () {
        let oldPassword = $(".reset .set .name>input").val();
        let newPassword = $(".reset .set .password>input").val();
        let lastPassword = $(".reset .set .sure>input").val();
        if ((newPassword && lastPassword) != '') {
            $(".cover").show();
            XHR.get(baseurl + 'password', {
                    psw0: oldPassword,
                    psw1: newPassword,
                    psw2: lastPassword
                },
                function (x, info) {
                    console.log(info);
                    $(".cover").hide();
                    if (info != null) {
                        if (info.msg === "success") {
                            $(".reset .set .tip").html("<p>修改成功</p>");
                            window.location.reload();
                        } else {
                            $(".reset .set .tip").html("<p>" + info.msg + "</p>");
                        }
                    } else {
                        $(".reset .set .tip").html("<p>页面过期，请刷新页面再重试</p>");
                    }
                });
        } else if (oldPassword == '') {
            $(".reset .set .tip").html("<p>请输入旧密码</p>")
        } else if (newPassword == '') {
            $(".reset .set .tip").html("<p>请输入新密码</p>")
        } else if (lastPassword == '') {
            $(".reset .set .tip").html("<p>请再次输入新密码</p>")
        }
    });
    // 重新启动
    $(".restart .usual>a").on("click", function () {
        $(".cover").show();
        console.log("Reboot...");
        XHR.get(baseurl + 'reboot', {reboot: 100},
            function (x, info) {
                if (x) {
                    alert("页面已过期，请重试！");
                    window.location.reload();
                }
            });
        setTimeout(() => {
            XHR.get(baseurl + 'test', null,
                function (x, info) {
                    $(".cover").hide();
                    window.location.reload();
                });
        }, 8000)
    });
    // 系统升级
    $(".isUpdate").on("click", function () {
        $(".cover").show();
        XHR.get(baseurl + 'upgrade', {image: 1},
            function (x, info) {
                $(".cover").hide();
                console.log(info);
                if (info == null) {
                    alert("页面已过期，请重试！");
                    window.location.reload();
                }
                let status = false;
                let msg = "更新下载成功,请点击确认开始更新。<br/> 注意：更新过程中请勿断开电源！更新完毕系统会自动重启。";
                if (info.data.msg === "success") {
                    status = true;
                } else {
                    msg = info.data.msg;
                }
                $(".updata-box").show();
                $(".updata-box>p").html(msg);
                if (!status) {
                    $(".makeSure").hide();
                }
            });
    });
    $(".makeSure").on("click", function () {
        $(".updata-box").hide();
        $(".cover").show();
        console.log("Upgrade...");
        XHR.get(baseurl + 'upgrade', {upgrade: 100},
            function (x, info) {
                console.log(info);
            });
        setTimeout(() => {
            XHR.get(baseurl + 'test', null,
                function (x, info) {
                    $(".cover").hide();
                    window.location.reload();
                });
        }, 8000)
    });
    $(".cancel").on("click", function () {
        $(".updata-box").hide();
    });

    // 恢复出厂设置
    $(".recovery .usual>a").on("click", function () {
        $(".cover").show();
        console.log("Recovery...");
        XHR.get(baseurl + 'reset', {reset: 100},
            function (x, info) {
                if (x) {
                    alert("页面已过期，请重试！");
                    window.location.reload();
                }
            });
        setTimeout(() => {
            $(".cover").hide();
            window.location.reload();
        }, 8000)
    });

    // 游戏选择切换
    $(".igame").on("click", function () {
        let index = $(this).index();
        $(this).addClass("choice").siblings(".igame").removeClass("choice")
        $(".games").eq(index).show().siblings(".games").hide();
    })
    // 游戏
    let games = {
        all: ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"],
        ps4: ["2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2",],
        sw: ["3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3"],
        xbox: ["4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "4"]
    };
    // 全部游戏
    let item = '';
    for (let list of games.all) {
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
    for (let list of games.ps4) {
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
    for (let list of games.sw) {
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
    for (let list of games.xbox) {
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

function formatSeconds(value) {
    var theTime = parseInt(value);// 需要转换的时间秒
    var theTime1 = 0;// 分
    var theTime2 = 0;// 小时
    var theTime3 = 0;// 天
    if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
            if (theTime2 > 24) {
                //大于24小时
                theTime3 = parseInt(theTime2 / 24);
                theTime2 = parseInt(theTime2 % 24);
            }
        }
    }
    var result = '';
    if (theTime > 0) {
        result = "" + parseInt(theTime) + "秒";
    }
    if (theTime1 > 0) {
        result = "" + parseInt(theTime1) + "分" + result;
    }
    if (theTime2 > 0) {
        result = "" + parseInt(theTime2) + "小时" + result;
    }
    if (theTime3 > 0) {
        result = "" + parseInt(theTime3) + "天" + result;
    }
    return result;
}