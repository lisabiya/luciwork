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
}

/*******************后端api*********************/
// 测试服接口
// 测试服接口
let url = "http://api.liuxing.321174.com/box/server/";
let nodes = [];
let list = [];
let index = 0;
let itemList = {};
let clickState;

getList();

// 获取节点
function getNode(name, defaultNode) {
    $.ajax({
        url: url + 'get_line_list',
        dataType: 'json',
        type: 'POST',
        data: {
            "server_name": name
        },
        success(res) {
            nodes = res.data;
            if (defaultNode != null) {
                $(".areas .show-node").html(defaultNode);
            } else {
                $(".areas .show-node").html(nodes[0].name);
            }

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
/**
 * 请求设备列表
 * @param defaultIP 显示指定ip的连接状态
 * @param errMsg    若存在错误消息，显示失败IP的错误信息
 */
function getDeviceList(defaultIP, errMsg) {
    proxyRouter("deviceList", null, function (x, info) {
        printJs(info, "getDeviceList");
        if (info == null || info.deviceList == null) {
            printJs("获取数据失败", "getDeviceList");
            return
        }

        let item = '';
        let status = '';
        for (let i = 0; i < info.deviceList.length; i++) {
            const value = info.deviceList[i];
            if (value.status != null && value.status.status === 0) {
                status = "active";
                if (defaultIP != null) {
                    if (defaultIP === value.ipAddr) {
                        status = "active isClick";
                        $(".success-speedState").show();
                        $(".no-speedState").hide();
                        $(".speedState").hide();
                    }
                } else {
                    if (i === 0) {
                        status = "active isClick";
                        $(".success-speedState").show();
                        $(".no-speedState").hide();
                        $(".speedState").hide();
                    }
                }
            } else {
                status = "";
                if (defaultIP != null) {
                    if (defaultIP === value.ipAddr) {
                        status = "isClick";
                        if (errMsg != null) {
                            status = "fail isClick";
                            printJs(errMsg, "错误信息")
                        }
                        $(".success-speedState").hide();
                        $(".no-speedState").show();
                        $(".speedState").hide();
                    }
                } else {
                    if (i === 0) {
                        status = "isClick";
                        $(".success-speedState").hide();
                        $(".no-speedState").show();
                        $(".speedState").hide();
                    }
                }
            }
            item += `
			<div class="item ${status}" macAddr=${value.macAddr} ip=${value.ipAddr}
			 server=${value.server} node=${value.node}>
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
            var that = $(this);
            let ip = that.attr("ip");
            let macAddr = that.attr("macAddr");
            let server = that.attr("server");
            itemList[ip] = that;

            let isAct = that.hasClass("active");
            that.addClass("isClick").siblings().removeClass("isClick");
            clickState = that.hasClass("isClick");
            if (isAct) {
                //设置区服信息
                $(".server .show-node").html(server);
                getNode(server);
                //设置连接状态
                $(".success-speedState").attr("ip", ip).attr("macAddr", macAddr).show();
                $(".no-speedState").attr("ip", ip).attr("macAddr", macAddr).hide();
                $(".speedState").attr("ip", ip).attr("macAddr", macAddr).hide();
            } else {
                //设置区服信息
                $(".server .show-node").html(list[0].name);
                getNode(list[0].name);
                //设置连接状态
                $(".success-speedState").attr("ip", ip).attr("macAddr", macAddr).hide();
                $(".no-speedState").attr("ip", ip).attr("macAddr", macAddr).show();
                $(".speedState").attr("ip", ip).attr("macAddr", macAddr).hide();
            }
        });
    }
}

// 开始加速
$(".no-speedState").on("click", function () {
    if (nodes[index] == null) {
        alert("获取区服信息失败");
        return
    }
    let info = JSON.parse(localStorage.getItem('userInfor'));
    if (info == null) {
        alert("请先登录");
        return
    }
    const stateLen = $(".active").length;
    if (stateLen >= 2) {
        alert("链接设备已达上限，请先选择一台设备断开连接");
        return;
    }
    $(".success-speedState").hide();
    $(".no-speedState").hide();
    $(".speedState").show();
    //请求开启代理
    let ip = $(this).attr("ip");
    let macAddr = $(this).attr("macAddr");
    let server = $(".server .show-node").html();
    let node = $(".areas .show-node").html();

    itemList[ip].removeClass("active");
    itemList[ip].removeClass("fail");

    proxyRouter('requestProxy', JSON.stringify({
        client: ip, //设备ip
        // proxyServer: "45.253.26.139:5000",//代理地址
        proxyServer: nodes[index].proxyIp + ":" + nodes[index].port,//代理地址
        user: nodes[index].user,//代理用户名
        password: macAddr.replace(/:/g, ""),//代理密码
        server: server, //区服
        node: node, //节点
    }), function (x, info) {
        printJs(info, "开始加速");
        getDeviceStatusWithTimeOut(ip, 15, function (statusInfo) {
            printJs(statusInfo, "timeout");
            if (statusInfo != null) {
                switch (statusInfo.status) {
                    case 0:
                        getDeviceList(ip);
                        break;
                    default:
                        getDeviceList(ip, statusInfo.msg);
                        break
                }
            } else {
                getDeviceList(ip, "未知错误");
            }
        });
    });
});

// 停止加速
$(".success-speedState").on("click", function () {
    let ip = $(this).attr("ip");
    $(".success-speedState").hide();
    $(".no-speedState").hide();
    $(".speedState").show();
    proxyRouter('stopProxy', JSON.stringify({
        client: ip, //设备ip
    }), function (x, info) {
        printJs(info, "停止加速");
        getDeviceList(ip);
    });
});

function printJs(info, tag) {
    console.log(tag == null ? "callBackInfo" : tag, info);
    // const jsonInfo = JSON.stringify(info);
    // console.log("callBackInfoJson", jsonInfo);
}


let DeviceStatusIntervalList = {};
let DeviceStatusTimeoutList = {};

function getDeviceStatusWithTimeOut(ip, timeout, statusCallback) {
    clearInterval(DeviceStatusIntervalList[ip]);
    clearTimeout(DeviceStatusTimeoutList[ip]);
    getDeviceStatus(ip, statusCallback);
    DeviceStatusIntervalList[ip] = setInterval(function () {
        getDeviceStatus(ip, statusCallback)
    }, 1000);
    DeviceStatusTimeoutList[ip] = setTimeout(function () {
        if (statusCallback != null) {
            statusCallback({"status": -4, "msg": "连接超时"});
            clearInterval(DeviceStatusIntervalList[ip]);
            proxyRouter('stopProxy', JSON.stringify({
                client: ip, //设备ip
            }))
        }
    }, timeout * 1000)
}

function getDeviceStatus(ip, statusCallback) {
    proxyRouter('getDeviceStatus', JSON.stringify({
        client: ip
    }), function (x, info) {
        printJs(info, "getDeviceStatus");
        if (info != null && info.response != null) {
            if (info.response.status === 0) {
                statusCallback(info.response);
                statusCallback = null;
                clearInterval(DeviceStatusIntervalList[ip]);
                clearTimeout(DeviceStatusTimeoutList[ip]);
            }
        }
    });
}
