bean_success_deviceList = {
    "deviceList": [{
        "macAddr": "04:d4:c4:48:aa:41",
        "hostname": "静态IP设备",
        "device": "br-lan",
        "connectStatus": true,
        "ipAddr": "192.168.1.155"
    }, {
        "macAddr": "fc:ab:90:19:ff:d9",
        "hostname": "HONOR_20_PRO-9fe1765dccdb",
        "device": "br-lan",
        "area": "国服",
        "node": "华东-香港01",
        "status": {"status": 0, "msg": "成功", "time": "2020-05-23 06:51:12"},
        "connectStatus": true,
        "ipAddr": "192.168.1.239"
    }, {
        "macAddr": "fc:ab:90:19:ff:d9",
        "hostname": "HONOR_20",
        "device": "br-lan",
        "connectStatus": true,
        "ipAddr": "192.168.1.238"
    }, {
        "macAddr": "fc:ab:90:19:ff:d9",
        "hostname": "HONOR_30",
        "device": "br-lan",
        "connectStatus": true,
        "ipAddr": "192.168.1.239"
    }], "code": 200
};
bean_success_requestProxy = {"response": "ok", "code": 200};

bean_success_stopProxy = {"response": "ok", "code": 200};

bean_success_getDeviceStatus = {
    "msg": "解析json成功",
    "response": {"status": 0, "msg": "成功", "time": "2020-05-22 13:02:03"},
    "code": 200
};
bean_fail_getDeviceStatus = {
    "msg": "解析json成功",
    "response": {"status": -3, "msg": "设备连接状态文件不存在", "time": "2020-05-22 13:02:03"},
    "code": 200
};

