//全局请求函数
function proxyRouter(router, mapValue, callback) {
    if (callback == null) {
        callback = function (x, info) {
            console.log("callBackInfo", info);
            const jsonInfo = JSON.stringify(info);
            console.log("callBackInfoJson", jsonInfo)
        }
    }
    XHR.get(baseurl + "proxyRouter", {
        router: router,
        mapValue: mapValue
    }, callback);
    switch (router) {
        case "":
            callback("", {})
            break

    }
}

/*******************后端api*********************/
// 测试服接口
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

getList();

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
            getNode(list[0].name);
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


$(".header >a").on("click", function () {
    getDeviceList();
});
getDeviceList();

/*******************lua api*********************/
let intervalFactory;

/**
 * 请求设备列表
 */
function getDeviceList() {
    proxyRouter("deviceList", null, function (x, info) {
        console.log("getDeviceList", info);
        const jsonInfo = JSON.stringify(info);
        console.log("callBackInfoJson", jsonInfo)

        let item = '';
        let status = '';
        for (let i = 0; i < info.deviceList.length; i++) {
            const value = info.deviceList[i];
            if (value.status != null && value.status.status === 0) {
                status = "active";
                $(".no-speedState").hide();
                $(".speedState").hide();
                $(".success-speedState").show();
            } else {
                status = "";
            }
            item += `
			<div class="item ${status}" state=${value.connectStatus} ip=${value.ipAddr}>
				<div class="group">
					<span class="iconfont">&#xe679;</span>
					<p>${value.hostname}</p>
				</div>
				<div class="group">${value.ipAddr}</div>
				<div class="group">
					<a></a>
				</div>
			</div>
		`;
            $(".equs").html(item);
        }
        setClickEvent()
    });

    function setClickEvent() {
        $(".equs .item").on("click", function () {
            that = $(this);
            let isAct = that.hasClass("active");
            that.addClass("isClick").siblings().removeClass("isClick");
            clickState = that.hasClass("isClick");
            if (isAct) {
                // alert("主机已加速，请勿重复连接！");
                $(".success-speedState").show();
                $(".no-speedState").hide();
                $(".speedState").hide();
            } else {
                $(".success-speedState").hide();
                $(".speedState").hide();
                $(".no-speedState").show();
                that.addClass("noactive").siblings().removeClass("noactive");
            }
        });
    }
}

// 开始加速
$(".no-speedState").on("click", function () {
    stateLen = $(".active").length;
    if (stateLen >= 2) {
        alert("链接设备已达上限，请先断开连接");
        return;
    }
    if (nodes[index] == null) {
        alert("获取用户信息失败");
        return
    }
    $(".success-speedState").hide();
    $(".no-speedState").hide();
    $(".speedState").show();
    //请求开启代理
    let ip = that.attr("ip");
    proxyRouter('requestProxy', JSON.stringify({
        client: ip, //设备ip
        // proxyServer: "45.253.26.139:5000",//代理地址
        proxyServer: nodes[index].proxyIp + ":" + nodes[index].port,
        user: nodes[index].user,//代理用户名
        password: nodes[index].password,//代理密码
    }), function (x, info) {
        console.log("callBackInfo", info);
        intervalRequestStatus(ip);
    });
});

// 停止加速
$(".success-speedState").on("click", function () {
    let ip = that.attr("ip");
    proxyRouter('stopProxy', JSON.stringify({
        client: ip, //设备ip
    }), function (x, info) {
        console.log("callBackInfo", info);
        intervalRequestStatus(ip);
    });
});


function intervalRequestStatus(ip) {
    clearInterval(intervalFactory);
    getDeviceStatus(ip);
    intervalFactory = setInterval(function () {
        //查询设备连接状态
        getDeviceStatus(ip)
    }, 5000)
}

function getDeviceStatus(ip) {
    proxyRouter('getDeviceStatus', JSON.stringify({
        client: ip //设备ip
    }), function (x, info) {
        console.log("getDeviceStatus", info);
        if (info != null && info.response != null) {
            switch (info.response.status) {
                case 0:
                    console.log("状态信息", info.response.msg);
                    $(".speedState").hide();
                    $(".no-speedState").hide();
                    $(".success-speedState").show();
                    that.removeClass("noactive");
                    that.addClass("active");
                    break;
                default:
                    if (clickState) {
                        that.removeClass("active");
                    }
                    $(".success-speedState").hide();
                    $(".no-speedState").show();
                    $(".speedState").hide();
                    console.log("状态信息", info.response.msg);
                    break
            }
        } else {
        }
    })
}

