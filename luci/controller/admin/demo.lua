module("luci.controller.admin.demo", package.seeall)
require "luci.tools.status"

function index()
    entry({ "admin", "demo" }, firstchild(), "Demo", 60).dependent = false
    entry({ "admin", "demo", "demo1" }, template("demo/index"), "demo1", 2)
    entry({ "admin", "demo", "proxy" }, template("demo/proxy"), "proxy", 10)

    entry({ "admin", "demo", "demo1", "game" }, call("goGame"), "demo1", 3)

    entry({ "admin", "demo", "demo1", "readDemo" }, call("readDemo"))
    entry({ "admin", "demo", "demo1", "test" }, call("test"))
    entry({ "admin", "demo", "demo1", "testSocket" }, call("ping"))
    entry({ "admin", "demo", "demo1", "getWifiList" }, call("getWifiList"))
    entry({ "admin", "demo", "demo1", "getJson" }, call("getJson"))

    entry({ "admin", "demo", "demo1", "systemRouter" }, call("systemRouter"))

end

function readDemo()
    if luci.http.formvalue("status") == "1" then

        local rv = {
            uptime = "ceshi",
            leases = luci.tools.status.dhcp_leases(),
            leases6 = luci.tools.status.dhcp6_leases(),
        }

        luci.http.prepare_content("application/json")
        luci.http.write_json(rv)
        return
    end
end

function test()
    status = luci.http.formvalue("status")

    --env = luci.http.getenv()
    devices = luci.sys.net.devices()
    local uci = require("luci.model.uci").cursor()

    local nets = {}
    uci:foreach("wireless", "wifi-iface", function(s)
        nets[#nets + 1] = s
    end)

    --
    local ntm = require "luci.model.network".init()
    local wifiDevices = ntm:get_wifidevs()

    local rv = { }
    for _, dev in ipairs(wifiDevices) do
        local rd = {
            up = dev:is_up(),
            device = dev:name(),
            name = dev:get_i18n(),
            networks = { }
        }
        rv[#rv + 1] = rd
    end

    local wifiNet = ntm:get_wifinet("ra1")
    ta1 = { wifiNet:assoclist() or 1, wifiNet:get_networks() or 2 }

    --local key1 = uci:get("wireless", 'wifinet1')

    --uci:section("wireless", "wifi-iface", "wifinet1", { ssid = 'wakfu', key = '90402899' })
    --uci:tset("wireless", "wifinet1", { device = 'mt7628'
    --, mode = 'ap'
    --, ssid = "lol"
    --, key = '12345678'
    --, ifname = 'ra2'
    --, network = 'lan'
    --, wmm = 1
    --, apsd = 0
    --, encryption = 'psk2+ccmp'
    --})
    --uci:set("wireless", "wifinet1", ".anonymous", "true")
    --uci:commit("wireless")

    --返回值
    luci.http.prepare_content("application/json")
    luci.http.write_json({ status = status
    , devices = devices
    , wifiDevices = wifiDevices
    , rv = rv
    , wifiNet = wifiNet
    , ta1 = ta1
    , sid = sid
    , set = data
    , nets = nets
    })
end

-- 获取wifi
function getWifiList()
    local status = require "luci.tools.status"
    wifiList = status.wifi_networks()
    local bus = require "ubus"
    local _ubus = bus.connect()
    local res, code = _ubus:call("iwinfo", "assoclist", { device = "br-lan" })

    --开启wifi
    --require("luci.controller.admin.network").wifi_reconnect("ra2")

    --返回值
    luci.http.prepare_content("application/json")
    luci.http.write_json({ code = code or 200, response = res, js = js, wifiList = wifiList })
end

function readIni()
    local json = require "luci.json"
    local mapValue = luci.http.formvalue("mapValue")
    local params, err = json.decode(mapValue)
    if params == nil then
        luci.http.prepare_content("application/json")
        luci.http.write_json({ code = 500, result = "参数格式不正确" })
        return
    end
    local client = params.client
    local localPort = params.localPort
    local proxyServer = params.proxyServer
    local user = params.user
    local password = params.password

    local ini = require 'luci.tools.ini'
    local configFile = "/etc/lxconfig.ini"

    local settings = ini.parse_file(configFile)
    if settings then
        --查找最大值
        maxIndex = 0
        for k, v in pairs(settings) do
            local index = k:match("^CLENT(%d+)$")
            index = tonumber(index)

            if index > maxIndex then
                maxIndex = index
            end
        end
        maxIndex = maxIndex + 1
        --添加新数据
        key = "CLENT" .. tostring(maxIndex)
        settings[key] = {
            clent = client,
            localport = localPort,
            proxyserver = proxyServer,
            user = user,
            passwd = password
        }
    else
        settings = {
            CLENT0 = {
                clent = client,
                localport = localPort,
                proxyserver = proxyServer,
                user = user,
                passwd = password
            }
        }
    end

    local state = ini.save(configFile, settings);
    --返回值
    luci.http.prepare_content("application/json")
    luci.http.write_json({ settings = settings, result = state })
end

function ping()
    require("luci.controller.admin.network").diag_ping("www.baidu.com")
end

function testSocket()
    require "nixio"

    response = { code = 200, response = "无数据响应" }
    local socket = nixio.socket("inet", "stream")
    local t = {}
    local tmp
    if not socket then
        response = { false, "创建socket失败" }
    end

    -- 测试连接
    if not socket:connect("192.169.132.88", "7777") then
        socket:close()
        response = { false, "服务无响应，连接服务器失败" }
    end
    -- 发送数据
    socket:send("lua Socket测试")
    repeat
        tmp = socket:recv(100)

        if tmp == false then
            socket:close()
            return false, "响应超时"
        end
        tmp = tostring(tmp)
        t[#t + 1] = tmp
    until #tmp < 1
    socket:close()
    local result = table.concat(t)
    response = { code = 200, response = result }

    luci.http.prepare_content("application/json")
    luci.http.write_json({ response = response })
end

function getJson()
    local fs = require "nixio.fs"
    local json = require "luci.json"

    local jsonFile = "/usr/me.json"
    --写数据
    local data = {
        user = "wakfu",
        password = "kanw",
        tesrt = "&[ss]"
    }
    --jsonData = json.encode(data)
    --fs.writefile(jsonFile, jsonData);
    --读数据
    local res, err = json.decode(fs.readfile(jsonFile) or "")

    --返回值
    luci.http.prepare_content("application/json")
    if res then
        luci.http.write_json({ code = 200, response = res, fuc = "解析json" })
    else
        luci.http.write_json({ code = 500, response = res, fuc = "解析json" })
    end
end

function systemRouter()
    router = luci.http.formvalue("router")
    RouterF = {
        info = getSystemInfo,
        ini = readIni
    }
    RouterF[router]()
end

function getSystemInfo()
    arp_table = {}
    leases = luci.tools.status.dhcp_leases()

    luci.sys.net.arptable(function(e)
        childTable = {
            macAddr = e["HW address"],
            device = e.Device,
            connectStatus = e.Flags ~= "0x0",
            hostname = "",
            ipAddr = "",
        }
        for _, v in pairs(leases) do
            if v["macaddr"] == childTable.macAddr then
                childTable.hostname = v["hostname"]
                childTable.ipAddr = v["ipaddr"]
            end
        end
        arp_table[#arp_table + 1] = childTable
    end)

    --
    local netm = require "luci.model.network"
    netm.init()
    local rv = { }
    ifaces = "lan,wan"
    for iface in ifaces:gmatch("[%w%.%-_]+") do
        local net = netm:get_network(iface)
        local device = net and net:get_interface()

        local data = {
            net = net,
            proto = net:proto(),
            uptime = net:uptime(),
            gwaddr = net:gwaddr(),
            dnsaddrs = net:dnsaddrs(),
            device = device,
            deviceType = device:type(),
            ipAddress = { },
            ip6Address = { },
            subDevices = { }
        }

        for _, a in ipairs(device:ipaddrs()) do
            data.ipAddress[#data.ipAddress + 1] = {
                addr = a:host():string(),
                netmask = a:mask():string(),
                prefix = a:prefix()
            }
        end
        for _, a in ipairs(device:ip6addrs()) do
            if not a:is6linklocal() then
                data.ip6Address[#data.ip6Address + 1] = {
                    addr = a:host():string(),
                    netmask = a:mask():string(),
                    prefix = a:prefix()
                }
            end
        end
        for _, device in ipairs(net:get_interfaces() or {}) do
            data.subDevices[#data.subDevices + 1] = {
                name = device:shortname(),
                type = device:type(),
                ifname = device:name(),
                macaddr = device:mac(),
                macaddr = device:mac(),
                is_up = device:is_up(),
                rx_bytes = device:rx_bytes(),
                tx_bytes = device:tx_bytes(),
                rx_packets = device:rx_packets(),
                tx_packets = device:tx_packets(),
            }
        end
        rv[#rv + 1] = data
    end

    --返回值
    luci.http.prepare_content("application/json")
    luci.http.write_json({ code = 200, arp_table = arp_table, leases = leases, device = rv })
end

function goGame()
    local tpl = require "luci.template"
    tpl.render("demo/game")
end