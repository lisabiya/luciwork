module("luci.controller.admin.proxy", package.seeall)
require "luci.tools.status"

function index()
    entry({ "admin", "demo", "proxy", "proxyRouter" }, call("proxyRouter"))
end

function ping()
    require("luci.controller.admin.network").diag_ping("www.baidu.com")
end

local function readIni()
    local ini = require 'luci.tools.ini'
    local configFile = "/etc/lxconfig.ini"

    local client = params.client
    local localPort = params.localPort
    local proxyServer = params.proxyServer
    local user = params.user
    local password = params.password

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
        --新建数据
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

local function testSocket(index)
    require "nixio"
    response = "changeuse" .. index
    local socket = nixio.socket("inet", "stream")
    local t = {}
    local tmp
    if not socket then
        response = { false, "创建socket失败" }
    end

    -- 测试连接
    if not socket:connect("127.0.0.1", "6233") then
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

local function getDeviceList()
    local deviceList = {}
    local leases = luci.tools.status.dhcp_leases()
    local device = {}

    luci.sys.net.arptable(function(e)
        if e.Device == "br-lan" then
            local childTable = {
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
            deviceList[#deviceList + 1] = childTable
        end
    end)

    --返回值
    luci.http.prepare_content("application/json")
    luci.http.write_json({ code = 200, deviceList = deviceList, device = device })
end

function proxyRouter()
    local json = require "luci.json"

    local router = luci.http.formvalue("router")
    local mapValue = luci.http.formvalue("mapValue")
    if mapValue and mapValue ~= "null" then
        params = json.decode(mapValue)
        if params == nil then
            luci.http.prepare_content("application/json")
            luci.http.write_json({ code = 500, result = "mapValue 参数格式不正确 请传jsonObject", mapValue = mapValue })
            return
        end
    end
    RouterF = {
        deviceList = getDeviceList,
        ini = readIni
    }
    RouterF[router]()
end

