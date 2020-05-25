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
var ip = [];
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
function getList(device_name) {
    device_name = "ps4"
    $.ajax({
        url: url + 'get_area_server',
        dataType: "json",
        type: "POST",
        data: {
            "device_name": device_name
        },
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
            "connectStatus": true,
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
            status = "active isClick";
            $(".no-speedState").hide();
            $(".success-speedState").show();
            ip = i.ipAddr
            console.log(ip)
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
$(document).on("click", ".equs .item", function () {
    that = $(this);
    ip = $(this).attr("ip");
    console.log(ip)
    let isAct = that.hasClass("active");
    stateLen = $(".active").length;
    that.addClass("isClick").siblings().removeClass("isClick");
    clickState = that.hasClass("isClick");
    if (isAct) {
        console.log("主机已加速，请勿重复连接！");
        $(".success-speedState").show();
        $(".no-speedState").hide();
        that.addClass("noactive").siblings().removeClass("noactive");
    } else {
        if (stateLen > 1) {
            console.log("链接设备已达上限，请先断开连接")
            that.removeClass("isClick");
            $(".success-speedState").show();
        } else {
            $(".success-speedState").hide();
            $(".no-speedState").show();
            that.addClass("noactive").siblings().removeClass("noactive");
        }
    }

    // 开始加速
    if (clickState) {
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
                that.addClass("isClick");
                $(".limit").hide();
            }, 2500);
        });
    } else {
        console.log("请选择游戏设备")
    }
})

// 停止加速
$(".success-speedState").on("click", function () {
    if (clickState) {
        that.removeClass("active");
        if (stateLen > 1) {
            that.removeClass("noactive");
        } else {
            that.addClass("noactive");
            $(".success-speedState").hide();
            $(".no-speedState").show();
            $(".speedState").hide();
        }
    }
});
