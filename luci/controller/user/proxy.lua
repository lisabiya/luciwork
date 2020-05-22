module("luci.controller.user.proxy", package.seeall)
local toolStatus = require "luci.tools.status"
local fs = require "nixio.fs"
local json = require "luci.json"
local ini = require 'luci.tools.ini'
local configFile = "/etc/lxconfig.ini"

function index()
    entry({ "user", "home", "proxyRouter" }, call("proxyRouter"))
end

function ping()
    require("luci.controller.admin.network").diag_ping("www.baidu.com")
end

---文件是否存在
---@param path string 文件名
function file_exists(path)
    local file = io.open(path, "r")
    if file then
        file:close()
    end
    return file ~= nil
end

local statusMap = {
    [-3] = "设备连接状态文件不存在",
    [-2] = "设备连接状态文件数据格式错误",
    [-1] = "未知错误",
    [0] = "成功",
    [1] = "连接服务器错误",
    [2] = "获取加速文件错误",
    [3] = "解析加速文件错误",
    [4] = "连接中",
    [5] = "连接中",
    [6] = "连接中",
}

---读取设备连接状态
---@param ip file | string  设备ip地址
---@return table | nil  {time: "2020-05-21 07:50:23", status: 0}
function readDeviceStatus(ip)
    local jsonFile = "/tmp/client-" .. ip
    --读数据
    if file_exists(jsonFile) then
        local data, code, msg = fs.readfile(jsonFile)
        if data then
            data = string.gsub(data, "\\", "")
        else
            return nil
        end
        response = json.decode(data or "")
        if response then
            response["msg"] = statusMap[response.status]
        else
            response = { msg = statusMap[-2], status = -2 }
        end
        return response
    else
        return { msg = statusMap[-3], status = -3 }
    end
end

---读取代理配置文件
---@return table | nil  {time: "2020-05-21 07:50:23", status: 0}
function readSetting()
    if file_exists(configFile) then
        settings = ini.parse_file(configFile)
        if settings == nil or settings["CLENT0"] == nil or settings["CLENT1"] == nil then
            return {
                CLENT0 = {
                    localport = 65431
                },
                CLENT1 = {
                    localport = 65432
                }
            }
        end
        return settings
    else
        return nil
    end
end

--- 给下层发送消息，请求开启代理
--- @param index  number 设备标识例如：CLENT0 则index为0
local function callToProxy(index)
    luci.http.prepare_content("application/json")
    require "nixio"
    requestMsg = "changeuse" .. index
    local socket = nixio.socket("inet", "stream")
    local t = {}
    local tmp
    if not socket then
        luci.http.write_json({ code = 500, msg = "创建socket失败" })
        return
    end

    -- 测试连接-127.0.0.1
    if not socket:connect("192.168.1.1", "6233") then
        socket:close()
        luci.http.write_json({ code = 500, "服务无响应，连接服务器失败" })
        return
    end
    -- 发送数据
    socket:send(requestMsg)
    repeat
        tmp = socket:recv(100)
        if tmp == false then
            break
        end
        tmp = tostring(tmp)
        t[#t + 1] = tmp
    until #tmp < 1
    socket:close()
    if #t == 0 then
        luci.http.write_json({ code = 500, response = "响应超时" })
        return
    else
        local result = table.concat(t)
        luci.http.write_json({ code = 200, response = result })
    end
end

function download(host, file)
    require "nixio"
    local socket = nixio.socket("inet", "stream")
    local f = io.open("/usr/test.html", "w+")
    if not socket:connect(host, 80) then
        socket:close()
        return
    end
    socket:send("GET " .. file .. " HTTP/1.0\r\n\r\n")

    local tmp
    repeat
        tmp = socket:recv(1024)
        if tmp == false then
            break
        end
        tmp = tostring(tmp)
        f:write(tmp)
    until #tmp < 1
    socket:close()
    f:close()
end

--请求开启代理
local function requestProxy()
    local client = params.client
    local proxyServer = params.proxyServer
    local user = params.user
    local password = params.password

    local settings = readSetting()
    local createIndex = 0
    if settings then
        for k, v in pairs(settings) do
            if v.clent == client or v.clent == nil or v.clent == "" or v.clent == "''" then
                local index = k:match("^CLENT(%d+)$")
                createIndex = tonumber(index)
            end
        end
        local key = "CLENT" .. createIndex
        settings[key]["clent"] = client
        settings[key]["proxyserver"] = proxyServer
        settings[key]["user"] = user
        settings[key]["passwd"] = password
    else
        luci.http.prepare_content("application/json")
        luci.http.write_json({ code = 500, configFile = configFile, msg = "配置文件不存在" })
        return
    end

    local state = ini.save(configFile, settings);
    if state then
        callToProxy(createIndex)
        return
    end
    --返回值
    luci.http.prepare_content("application/json")
    luci.http.write_json({ code = 200, settings = settings, state = state })
end

--请求关闭代理
local function stopProxy()
    local client = params.client

    local settings = readSetting()
    local createIndex = -1
    if settings then
        for k, v in pairs(settings) do
            if v.clent == client then
                local index = k:match("^CLENT(%d+)$")
                createIndex = tonumber(index)
            end
        end
    else
        luci.http.prepare_content("application/json")
        luci.http.write_json({ code = 500, configFile = configFile, msg = "配置文件不存在" })
        return
    end

    if createIndex == -1 then
        luci.http.prepare_content("application/json")
        luci.http.write_json({ code = 500, configFile = configFile, msg = "配置文件中未找到该设备" })
        return
    end

    key = "CLENT" .. createIndex
    settings[key]["clent"] = "''"
    settings[key]["proxyserver"] = "''"
    settings[key]["user"] = "''"
    settings[key]["passwd"] = "''"

    local state = ini.save(configFile, settings);
    if state then
        callToProxy(createIndex)
        return
    end
    --返回值
    luci.http.prepare_content("application/json")
    luci.http.write_json({ code = 200, settings = settings, state = state, size = #settings })
end

--获取连接设备列表
local function getDeviceList()
    local deviceList = {}
    local leases = toolStatus.dhcp_leases()
    local devList = {}
    luci.sys.net.arptable(function(e)
        devList[#devList + 1] = e
        if e.Device == "br-lan" and e.Flags ~= "0x0" then
            local childTable = {
                macAddr = e["HW address"],
                device = e.Device,
                connectStatus = e.Flags ~= "0x0",
                ipAddr = e["IP address"],
                hostname = "静态IP设备"
            }
            for _, v in pairs(leases) do
                if v["macaddr"] == e["HW address"] then
                    childTable.hostname = v["hostname"]
                end
            end
            deviceList[#deviceList + 1] = childTable
        end
    end)
    --通过代理配置文件列表的ip读取设备连接状态文件
    for k, v in pairs(deviceList) do
        local settings = readSetting()
        if settings then
            for _, setting in pairs(settings) do
                if setting.clent == v.ipAddr then
                    v.status = readDeviceStatus(v.ipAddr)
                end
            end
        end
    end
    --返回值
    luci.http.prepare_content("application/json")
    luci.http.write_json({ code = 200, deviceList = deviceList, leases = leases, devList = devList })
end

--获取设备连接状态
function getDeviceStatus()
    luci.http.prepare_content("application/json")
    if params == nil then
        luci.http.write_json({ code = 500, response = "参数client不可为空" })
        return
    end
    local settings = readSetting()
    local status
    if settings then
        for _, setting in pairs(settings) do
            if setting.clent == params.client then
                status = readDeviceStatus(params.client)
            end
        end
    end
    --返回值
    if status then
        luci.http.write_json({ code = 200, response = status, msg = "解析json成功" })
    else
        luci.http.write_json({ code = 500, response = { msg = statusMap[-3], status = -3 }, msg = statusMap[-3] })
    end
end

--通用路由
function proxyRouter()
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
        requestProxy = requestProxy,
        stopProxy = stopProxy,
        getDeviceStatus = getDeviceStatus
    }
    RouterF[router]()
end

