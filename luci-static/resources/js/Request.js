// 测试服接口
var url = "http://api.liuxing.321174.com/box/server/";
var nodes = [];
var list = [];
var index = 0;
var info = {};
var isContent = [];
var that;
var stateLen = "";
var clickState;
//全局请求函数
getList();

function proxyRouter(router,    //路由
                     mapValue,  //参数
                     callback   //回调
) {
    callback(info);
}

/*******************api*********************/
// 获取节点
function getNode(name) {
    $.ajax({
        url: url + 'get_line_list',
        dataType: 'json',
        type: 'POST',
        data: {
            "server_name": name
        },
        success(res) {
            nodes = res.data;
            $(".areas .show-node").html(nodes[0].name);
            let item = '';
            for (let i of nodes) {
                item += `
					<span infors=${i}>${i.name}</span>
				`
            }
            $(".areas .slide").html(item);
        },
        error(err) {
            console.log(err)
        }
    })
}

// 获取区服列表
function getList() {
    $.ajax({
        url: url + 'get_area_server',
        dataType: "json",
        type: "POST",
        success(res) {
            list = res.data;
            $(".server .show-node").html(list[0].name);
            getNode(list[0].name)
            let item = '';
            for (let i of list) {
                item += `
					<span>${i.name}</span>
				`
            }
            $(".server .slide").html(item);
        },
        error(err) {
            console.log(err)
        }
    });
}

$(document).on("click", ".server .slide>span", function () {
    let text = $(this).text();
    $(".server .show-node").html(text);
    $(".server .slide").slideUp();
    getNode(text);
});

$(document).on("click", ".areas .slide>span", function () {
    let text = $(this).text();
    $(".areas .show-node").html(text);
    $(".areas .slide").slideUp();
    index = $(this).index();
});


/**
 * 请求设备列表
 */
proxyRouter("deviceList", null, function (x, info) {
    //返回示例
    info = {
        "deviceList": [{
            "macAddr": "04:d4:c4:48:aa:41", //mac地址
            "hostname": "DESKTOP-863HU69", //设备名
            "device": "br-lan", //网络端口
            "connectStatus": true, //连接状态
            "ipAddr": "192.168.1.195", //设备ip
            "icon": "&#xe679;"
        }, {
            "macAddr": "fc:ab:90:19:ff:d9",
            "hostname": "HONOR_20_PRO-9fe1765dccdb",
            "device": "br-Xan",
            "connectStatus": false,
            "ipAddr": "192.168.1.239",
            "icon": "&#xe64b;"
        }, {
            "macAddr": "fc:ab:90:19:ff:d9",
            "hostname": "HAHAHA_20_PRO-9fe1765dccdb",
            "device": "br-Nan",
            "connectStatus": false,
            "ipAddr": "192.168.1.000",
            "icon": "&#xe8e1;"
        }],
        "code": 200
    }
    let item = '';
    let status = '';
    for (let i of info.deviceList) {
        // 判断设备连接状态
        isContent = i.connectStatus;
        if (isContent) {
            status = "active";
            $(".no-speedState").hide();
            $(".success-speedState").show();
        } else {
            status = "";
        }
        item += `
			<div class="item ${status}" state=${i.connectStatus} ip=${i.ipAddr}>
				<div class="group">
					<span class="iconfont">${i.icon}</span>
					<p>${i.device}</p>
				</div>
				<div class="group">${i.ipAddr}</div>
				<div class="group">
					<a></a>
				</div>
			</div>
		`
        $(".equs").html(item)
    }

});


// 选择加速设备

$(".equs .item").on("click", function () {
    that = $(this);
    let ip = $(this).attr("ip");
    let isAct = that.hasClass("active");
    stateLen = $(".active").length;
    that.addClass("isClick").siblings().removeClass("isClick");
    clickState = that.hasClass("isClick");
    if (isAct) {
        alert("主机已加速，请勿重复连接！");
    } else {
        if (stateLen >= '2') {
            alert("链接设备已达上限，请先断开连接")
        } else {
            $(".success-speedState").hide();
            $(".no-speedState").show();
            that.addClass("noactive").siblings().removeClass("noactive");
        }
    }
});
// 开始加速
$(".no-speedState").on("click", function () {
    $(".success-speedState").hide();
    $(".no-speedState").hide();
    $(".speedState").show();
    $(".limit").show();
    setTimeout(() => {
        $(".speedState").hide();
        $(".success-speedState").show();
        that.removeClass("noactive");
        that.addClass("active");
        $(".limit").hide();
    }, 2500);
});
// 停止加速
$(".success-speedState").on("click", function () {
    if (clickState) {
        that.removeClass("active");
    }
    $(".success-speedState").hide();
    $(".no-speedState").show();
    $(".speedState").hide();
});


// 	proxyRouter('ini', JSON.stringify({
// 		client: ip, //设备ip
// 		proxyServer: nodes[index].proxyIp,//代理地址
// 		localPort: nodes[index].port,//代理端口号
// 		user: nodes[index].user,//代理用户名
// 		password: nodes[index].password,//代理密码
// 	}), function (x, info) {
// 		//返回示例
// 		info = {"response": "获取成功", "code": 200}
// 		if(info.code == "200"){
// 			// that.addClass("active").siblings().removeClass("active");
// 			// $(".success-speedState").hide();
// 			// $(".no-speedState").hide();
// 			// $(".speedState").show();
// 			setTimeout(()=>{
// 				// $(".speedState").hide();
// 				// $(".success-speedState").show();
// 				// $(".link-equ .limit").hide()
// 			},2500);
// 			// 查询设备连接状态
// 			// setInterval(()=>{
// 			// 	proxyRouter('json', JSON.stringify({
// 			// 	    client:ip //设备ip
// 			// 	}), function (x, info) {
// 			// 	    //返回示例
// 			// 	    info = {
// 			// 	        "msg": "解析json成功",
// 			// 	        "response": {
// 			// 	            "time": "2020-05-19 10:34:50", //更新时间
// 			// 	            "status": 1                    //状态
// 			// 	        },
// 			// 	        "code": 200
// 			// 	    }
// 			// 	console.log(info.code)
// 			// 	});
// 			// },3000)
// 		}
// 		console.log(info)
// 	});

//status 状态值
// -1,/*未知错误*/
// 0,/*成功*/
// 1,/*连接服务器错误*/
// 2,/*获取加速文件错误*/
// 3,/*解析加速文件错误*/
// 4, /*连接中*/
// 5, /*连接中*/
// 6 /*连接中*/
