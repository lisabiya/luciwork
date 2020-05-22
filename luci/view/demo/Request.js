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
    }, callback)
}


/*******************api*********************/
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
            "ipAddr": "192.168.1.195" //设备ip
        }, {
            "macAddr": "fc:ab:90:19:ff:d9",
            "hostname": "HONOR_20_PRO-9fe1765dccdb",
            "device": "br-lan",
            "connectStatus": true,
            "ipAddr": "192.168.1.239"
        }],
        "code": 200
    }
});

/**
 *请求开启代理
 */
proxyRouter('ini', JSON.stringify({
    client: ipAddr, //设备ip
    proxyServer: proxyServer,//代理地址
    localPort: localPort,//代理端口号
    user: account,//代理用户名
    password: password,//代理密码
}, function (x, info) {
    //返回示例
    info = {"response": "获取成功", "code": 200}
}));

/**
 *查询设备连接状态
 */
proxyRouter('json', JSON.stringify({
    client: ipAddr //设备ip
}), function (x, info) {
    //返回示例
    info = {
        "msg": "解析json成功",
        "response": {
            "time": "2020-05-19 10:34:50", //更新时间
            "status": 1                    //状态
        },
        "code": 200
    }
});

//status 状态值
// -1,/*未知错误*/
// 0,/*成功*/
// 1,/*连接服务器错误*/
// 2,/*获取加速文件错误*/
// 3,/*解析加速文件错误*/
// 4, /*连接中*/
// 5, /*连接中*/
// 6 /*连接中*/
