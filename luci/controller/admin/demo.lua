module("luci.controller.admin.demo", package.seeall)
require "luci.tools.status"

function index()
    entry({ "admin", "demo" }, firstchild(), "Demo", 60).dependent = false
    entry({ "admin", "demo", "demo1" }, template("demo/index"), "demo1", 2)

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
    local ini = require 'luci.tools.ini'
    local inifile = require 'luci.tools.inifile'

    settings1 = ini.parse_file("/usr/app.ini")
    settings2 = inifile.parse("/usr/app.ini")

    --返回值
    luci.http.prepare_content("application/json")
    luci.http.write_json({ settings1 = settings1, settings2 = settings2 })
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

    jsonFile = "/usr/me.json"
    --写数据
    data = {
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
    }
    RouterF[router]()
end

function getSystemInfo()
    arp_table = {}
    luci.sys.net.arptable(function(e)
        arp_table[#arp_table + 1] = e
    end)
    --返回值
    luci.http.prepare_content("application/json")
    luci.http.write_json({ code = 200, arp_table = arp_table })
end

function goGame()
    local tpl = require "luci.template"
    tpl.render("demo/game")
end