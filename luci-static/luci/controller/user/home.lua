--
-- Created by IntelliJ IDEA.
-- User: Bowen
-- Date: 2020/5/9
-- Time: 15:22
-- To change this template use File | Settings | File Templates.
--

local fs = require "nixio.fs"
local io = require "io"

module("luci.controller.user.home", package.seeall)

function index()
    entry({"user","home"}, alias("user", "home", "index"), _("Home"), 20).index = true
    entry({"user", "home", "home"}, template("user/home"))
    entry({"user", "home", "index"}, template("user/index"))
    entry({"user", "home", "info"}, call("get_info"))

    entry({"user", "home", "wifi"}, template("user/wifi"), _("Wifi"), 2)
    entry({"user", "home", "wifiset"}, call("set_wifi"))

--    entry({"user", "home", "gamelist"}, template("user/gamelist"),_("Games"), 3).leaf = true
    entry({"user", "home", "status"}, template("user/status"), _("Status"), 4)
    entry({"user", "home", "devinfo"}, call("device_info"))

    entry({"user","home","router"},template("user/router"))
    entry({"user","home","arptable"},call("get_arptable"))

    entry({"user", "home", "password"}, call("action_passwd"),_("Password"), 5)

    entry({"user", "home", "reset"}, call("action_reset"),_("Restore"), 6).leaf = true
--    entry({"user", "home", "upgrade"}, template("user/upgrade"),_("Upgrade"), 7).leaf = true

	entry({"user", "home", "reboot"}, call("action_reboot"),_("Reboot"), 8)

	entry({"user", "home", "test"}, call("wifidevs"),_("Test"), 9)

end

-- test -----------------------------------------------
-- fs.exec('/sbin/firstboot', ['-r', '-y'])
function test()
	luci.sys.wifi.getiwinfo(arg[1])

	luci.http.prepare_content("application/json")
	luci.http.write_json({data=data})
end

function get_info()
	require "luci.tools.status"
    require "luci.fs"
	local ntm = require "luci.model.network".init()
    local system, model, memtotal, memcached, membuffers, memfree, _, swaptotal, swapcached, swapfree = luci.sys.sysinfo()
	local wan = ntm:get_wannet()
    local wdev = ntm:get_wandev()
    local hostname = luci.sys.hostname()

--	local conn_count = tonumber((
--			luci.sys.exec("wc -l /proc/net/nf_conntrack") or
--			luci.sys.exec("wc -l /proc/net/ip_conntrack") or
--			""):match("%d+")) or 0
--	local conn_max = tonumber((
--			luci.sys.exec("sysctl net.nf_conntrack_max") or
--			luci.sys.exec("sysctl net.ipv4.netfilter.ip_conntrack_max") or
--			""):match("%d+")) or 4096

    local rv = {
		    hostname   = hostname,
		    system     = system,
		    model      = model,
			uptime     = luci.sys.uptime(),
			localtime  = os.date(),
			loadavg    = { luci.sys.loadavg() },
--			memtotal   = memtotal,
--			memcached  = memcached,
--			membuffers = membuffers,
--			memfree    = memfree,
--			swaptotal  = swaptotal,
--			swapcached = swapcached,
--			swapfree   = swapfree,
--			connmax    = conn_max,
--			conncount  = conn_count,
			leases     = luci.tools.status.dhcp_leases(),
--			leases6    = luci.tools.status.dhcp6_leases(),
			wifinets   = luci.tools.status.wifi_networks()
	}

	if wan then
		rv.wan = {
			ipaddr  = wan:ipaddr(),
			gwaddr  = wan:gwaddr(),
			netmask = wan:netmask(),
			dns     = wan:dnsaddrs(),
--			expires = wan:expires(),
			uptime  = wan:uptime(),
			proto   = wan:proto(),
			ifname  = wan:ifname(),
--			link    = wan:adminlink()
		}
	end
	if wdev then
		rv.wan.macaddr = wdev.dev.macaddr
	end
	luci.http.prepare_content("application/json")
	luci.http.write_json({ data = rv, status= 200})
end

function wifidevs()
	local ntm = require "luci.model.network".init()
    local devices  = ntm:get_wifidevs()

	local netlist = { }
	local netdevs = { }

	local dev
	for _, dev in ipairs(devices) do
		local net
		for _, net in ipairs(dev:get_wifinets()) do
			netlist[#netlist+1] = net:id()
			netdevs[net:id()] = dev:name()
		end
	end

	luci.http.prepare_content("application/json")
	luci.http.write_json({ data = netdevs, status= 200})
end

function wifi_status()
	local devs = luci.http.formvalue("devs")
	local s    = require "luci.tools.status"
	local rv   = { }

	local dev
	for dev in devs:gmatch("[%w%.%-]+") do
		rv[#rv+1] = s.wifi_network(dev)
	end

	if #rv > 0 then
		luci.http.prepare_content("application/json")
		luci.http.write_json(rv)
		return
	end

	luci.http.status(404, "No such device")
end
-- test ---------------------------------------------

-- 设置wifi
function set_wifi()
	local function param(x)
		return luci.http.formvalue(x)
	end

	local ssid = param("ssid")
    local pswd = param("pswd")
    local msg = ""
    local data = {}
    local flag = false
    local set_ssid,_ = string.gsub(luci.sys.exec("uci get wireless.@wifi-iface[-1].ssid"), "\n$", "")
    local set_pswd,_ = string.gsub(luci.sys.exec("uci get wireless.@wifi-iface[-1].key"), "\n$", "")

    if ssid and pswd then
		if set_ssid ~= ssid then
			luci.sys.exec("uci set wireless.@wifi-iface[-1].ssid='"..ssid.."'")
			flag = true
		end
		if set_pswd ~=pswd then
			if string.len(pswd)>7 then
				luci.sys.exec("uci set wireless.@wifi-iface[-1].key='"..pswd.."'")
				flag = true
			else
				msg = "error"
				flag = false
			end
		end
	end
	if flag then
		luci.sys.exec("uci commit wireless")
		-- os.execute("/etc/init.d/network restart")
		set_ssid,_ = string.gsub(luci.sys.exec("uci get wireless.@wifi-iface[-1].ssid"), "\n$", "")
		set_pswd,_ = string.gsub(luci.sys.exec("uci get wireless.@wifi-iface[-1].key"), "\n$", "")
		if set_ssid ~= ssid then
			msg = "fail"
		else
			msg = "success"
			data.name = set_ssid
			data.pswd = set_pswd

		end
	else
		data.name = set_ssid
		data.pswd = set_pswd
	end

	luci.http.prepare_content("application/json")
	luci.http.write_json({ msg=msg, data=data, status=200})
    if msg == "success" then
		io.popen("/etc/init.d/network restart")
	end
end

-- 获取设备展示信息
function device_info()
	local ntm = require "luci.model.network".init()
	local data = { }
	-- 设备名
    data.hostname = luci.sys.hostname() or "?"
	-- 型号
    local system, model = luci.sys.sysinfo()
    data.model = model or "?"
	-- 内核版本
    data.kernel = luci.sys.exec("uname -r") or "?"
	-- mac
    local wdev = ntm:get_wandev()
    data.macaddr = wdev.dev.macaddr or "?"
	-- ip
    local wan = ntm:get_wannet()
    if wan then
		data.ipaddr = wan:ipaddr() or "?"
	else
		data.ipaddr = "?"
	end

	-- 运行时间
    local localtime  = os.date()
	local uptime     = luci.sys.uptime()
    data.uptime = uptime or "?"

	luci.http.prepare_content("application/json")
	luci.http.write_json({ msg = data, status= 200})
end

-- ipv4路由
function get_routes(callback)
	local routes = { }

	for line in io.lines("/proc/net/route") do

		local dev, dst_ip, gateway, flags, refcnt, usecnt, metric,
			  dst_mask, mtu, win, irtt = line:match(
			"([^%s]+)\t([A-F0-9]+)\t([A-F0-9]+)\t([A-F0-9]+)\t" ..
			"(%d+)\t(%d+)\t(%d+)\t([A-F0-9]+)\t(%d+)\t(%d+)\t(%d+)"
		)

		if dev then
			gateway  = luci.ip.Hex( gateway,  32, luci.ip.FAMILY_INET4 )
			dst_mask = luci.ip.Hex( dst_mask, 32, luci.ip.FAMILY_INET4 )
			dst_ip   = luci.ip.Hex(
				dst_ip, dst_mask:prefix(dst_mask), luci.ip.FAMILY_INET4
			)

			local rt = {
				dest     = dst_ip:string(),
				gateway  = gateway:string(),
				metric   = tonumber(metric),
				refcount = tonumber(refcnt),
				usecount = tonumber(usecnt),
				mtu      = tonumber(mtu),
				window   = tonumber(window),
				irtt     = tonumber(irtt),
				flags    = tonumber(flags, 16),
				device   = dev
			}

			if callback then
				callback(rt)
			else
				routes[#routes+1] = rt
			end
		end
	end
	luci.http.prepare_content("application/json")
	luci.http.write_json({ data = routes, status= 200})
	return routes
end

-- 获取连接设备列表
function get_arptable(callback)
	local arp = (not callback) and {} or nil
	local e, r, v
	if fs.access("/proc/net/arp") then
		for e in io.lines("/proc/net/arp") do
			local r = { }, v
			for v in e:gmatch("%S+") do
				r[#r+1] = v
			end

			if r[1] ~= "IP" then
				local x = {
					["IP address"] = r[1],
					["HW type"]    = r[2],
					["Flags"]      = r[3],
					["HW address"] = r[4],
					["Mask"]       = r[5],
					["Device"]     = r[6]
				}

				if callback then
					callback(x)
				else
					arp = arp or { }
					arp[#arp+1] = x
				end
			end
		end
	end
	luci.http.prepare_content("application/json")
	luci.http.write_json({ data = arp, status= 200})
	return arp
end

-- 获取接口列表
function get_interfaces()
	local ntm = require "luci.model.network".init()

	local net
	local ifaces = { }
	for _, net in ipairs(ntm:get_networks()) do
		if net:name() ~= "loopback" then
			ifaces[#ifaces+1] = net:name()
		end
	end

	luci.http.prepare_content("application/json")
	luci.http.write_json({ data = ifaces, status= 200})
end

-- 接口状态信息
function iface_status()
	local iface = luci.http.formvalue("iface")
	local ntm = require "luci.model.network".init()

    local data = { }
	local net = ntm:get_network(iface)
	local device = net and net:get_interface()
    if device then
		data = {
			id         = iface,
			proto      = net:proto(),
			uptime     = net:uptime(),
			gwaddr     = net:gwaddr(),
			dnsaddrs   = net:dnsaddrs(),
			name       = device:shortname(),
			type       = device:type(),
			ifname     = device:name(),
			macaddr    = device:mac(),
			is_up      = device:is_up(),
			rx_bytes   = device:rx_bytes(),
			tx_bytes   = device:tx_bytes(),
			rx_packets = device:rx_packets(),
			tx_packets = device:tx_packets(),

			ipaddrs    = { },
--			ip6addrs   = { },
			subdevices = { }
		}
		local _, a
		for _, a in ipairs(device:ipaddrs()) do
			data.ipaddrs[#data.ipaddrs+1] = {
				addr      = a:host():string(),
				netmask   = a:mask():string(),
				prefix    = a:prefix()
			}
		end
--		for _, a in ipairs(device:ip6addrs()) do
--			if not a:is6linklocal() then
--				data.ip6addrs[#data.ip6addrs+1] = {
--					addr      = a:host():string(),
--					netmask   = a:mask():string(),
--					prefix    = a:prefix()
--				}
--			end
--		end

	end

	luci.http.prepare_content("application/json")
	luci.http.write_json({data = data, status= 200})

end

------------------------
function action_load()
	luci.http.prepare_content("application/json")

	local bwc = io.popen("luci-bwc -l 2>/dev/null")
	if bwc then
		luci.http.write("[")

		while true do
			local ln = bwc:read("*l")
			if not ln then break end
			luci.http.write(ln)
		end

		luci.http.write("]")
		bwc:close()
	end
end

-- 修改登录密码
function action_passwd()
	local p0 = luci.http.formvalue("psw0")
	local p1 = luci.http.formvalue("psw1")
	local p2 = luci.http.formvalue("psw2")
	local msg = nil

	if luci.sys.user.checkpasswd("root",p0) then
		if p1 or p2 then
			if p1 == p2 then
				if string.len(p1)>3 then
					local stat = luci.sys.user.setpasswd("root", p1)
					if stat == 0 then
						msg = "success"
					else
						msg = stat
					end
				else
					msg = "密码长度过短"
				end
			else
				msg = "两次密码不一致"
			end
		end
	else
		msg = "原密码错误"
	end
	luci.http.prepare_content("application/json")
	luci.http.write_json({ msg = msg, status= 200})
	--	luci.template.render("user/password", {msg = stat,status=200})
end

-- 重启设备
function action_reboot()
	local reboot = luci.http.formvalue("reboot")
	luci.template.render("user/reboot", {reboot=reboot})
	if reboot then
        fork_exec("sleep 5;reboot")
	end
	return "success"
end

-- 系统重置
function action_reset()
	local reset = luci.http.formvalue("reset")
    if reset then
		--重置配置文件
		luci.sys.exec("uci set wireless.@wifi-iface[-1].ssid='LiuxingBox'")
		luci.sys.exec("uci set wireless.@wifi-iface[-1].key='abc12345'")
		luci.sys.exec("uci commit wireless")
		luci.sys.user.setpasswd("root", '000000')
		fork_exec("sleep 5;reboot")
	end
--	local reset_avail   = os.execute([[grep '"rootfs_data"' /proc/mtd >/dev/null 2>&1]]) == 0
--    luci.template.render("user/reset", {reset=reset})
--    if reset_avail and reset then
--		luci.template.render("user/applyreboot", {
--			title = luci.i18n.translate("Erasing..."),
--			msg   = luci.i18n.translate("The system is erasing the configuration partition now and will reboot itself when finished."),
--			addr  = "192.168.1.1"
--		})
--		fork_exec("killall dropbear uhttpd; sleep 1; mtd -r erase rootfs_data")
--	end
end

-- 固件升级
function action_upgrade()
	local upgrade_avail = nixio.fs.access("/lib/upgrade/platform.sh")
    if not upgrade_avail then
		local msg = "系统错误，无法升级"
		luci.http.prepare_content("application/json")
	    luci.http.write_json({ msg = msg, status= 200})
		return
	end

	local upgrade = luci.http.formvalue("upgrade")
    local image = luci.http.formvalue("image")
    local keep = "" -- or "-n"

    local image_tmp  = image or "/tmp/firmware.img"
    local msg = ""
    local flag = false
    local data = { }

    -- 镜像检查
	local function image_supported()
		-- XXX: yay...
		return ( 0 == os.execute(
			". /lib/functions.sh; " ..
			"include /lib/upgrade; " ..
			"platform_check_image %q >/dev/null"
				% image_tmp
		) )
	end

    -- 镜像校验
	local function image_checksum()
		return (luci.sys.exec("md5sum %q" % image_tmp):match("^([^%s]+)"))
	end

	-- 固件大小
	local function storage_size()
		local size = 0
		if nixio.fs.access("/proc/mtd") then
			for l in io.lines("/proc/mtd") do
				local d, s, e, n = l:match('^([^%s]+)%s+([^%s]+)%s+([^%s]+)%s+"([^%s]+)"')
				if n == "linux" or n == "firmware" then
					size = tonumber(s, 16)
					break
				end
			end
		elseif nixio.fs.access("/proc/partitions") then
			for l in io.lines("/proc/partitions") do
				local x, y, b, n = l:match('^%s*(%d+)%s+(%d+)%s+([^%s]+)%s+([^%s]+)')
				if b and n and not n:match('[0-9]') then
					size = tonumber(b) * 1024
					break
				end
			end
		end
		return size
	end

    -- 镜像文件保存
	local fp
	luci.http.setfilehandler(
		function(meta, chunk, eof)
			if not fp then
				if meta and meta.name == "image" then
					fp = io.open(image_tmp, "w")
				else
					fp = io.popen(restore_cmd, "w")
				end
			end
			if chunk then
				fp:write(chunk)
			end
			if eof then
				fp:close()
			end
		end
	)

    if image_supported() then
		msg = "true"
		data.checksum = image_checksum()
		data.storage  = storage_size()
		data.size     = nixio.fs.stat(image_tmp).size
		flag = true
	else
		msg = "image error"
	end
    if flag then
--		luci.template.render("user/applyreboot", {
--			title = luci.i18n.translate("Flashing..."),
--			msg   = luci.i18n.translate("The system is flashing now.<br /> DO NOT POWER OFF THE DEVICE!<br /> Wait a few minutes before you try to reconnect. It might be necessary to renew the address of your computer to reach the device again, depending on your settings."),
--			addr  = "192.168.1.1"
--		})
		fork_exec("killall dropbear uhttpd; sleep 1; /sbin/sysupgrade %s %q" %{ keep, image_tmp })
	else
		luci.http.prepare_content("application/json")
	    luci.http.write_json({ msg = msg, data=data, status= 200})
	end
end

-- 系统备份/升级原始完整流程
function action_flashops()
	local sys = require "luci.sys"
	local fs  = require "luci.fs"

	local upgrade_avail = nixio.fs.access("/lib/upgrade/platform.sh")
	local reset_avail   = os.execute([[grep '"rootfs_data"' /proc/mtd >/dev/null 2>&1]]) == 0

	local restore_cmd = "tar -xzC/ >/dev/null 2>&1"
	local backup_cmd  = "sysupgrade --create-backup - 2>/dev/null"
	local image_tmp   = "/tmp/firmware.img"

	local function image_supported()
		-- 镜像检查
		-- XXX: yay...
		return ( 0 == os.execute(
			". /lib/functions.sh; " ..
			"include /lib/upgrade; " ..
			"platform_check_image %q >/dev/null"
				% image_tmp
		) )
	end

    -- 镜像校验
	local function image_checksum()
		return (luci.sys.exec("md5sum %q" % image_tmp):match("^([^%s]+)"))
	end

	-- 固件大小
	local function storage_size()
		local size = 0
		if nixio.fs.access("/proc/mtd") then
			for l in io.lines("/proc/mtd") do
				local d, s, e, n = l:match('^([^%s]+)%s+([^%s]+)%s+([^%s]+)%s+"([^%s]+)"')
				if n == "linux" or n == "firmware" then
					size = tonumber(s, 16)
					break
				end
			end
		elseif nixio.fs.access("/proc/partitions") then
			for l in io.lines("/proc/partitions") do
				local x, y, b, n = l:match('^%s*(%d+)%s+(%d+)%s+([^%s]+)%s+([^%s]+)')
				if b and n and not n:match('[0-9]') then
					size = tonumber(b) * 1024
					break
				end
			end
		end
		return size
	end

    -- 镜像/备份文件保存
	local fp
	luci.http.setfilehandler(
		function(meta, chunk, eof)
			if not fp then
				if meta and meta.name == "image" then
					fp = io.open(image_tmp, "w")
				else
					fp = io.popen(restore_cmd, "w")
				end
			end
			if chunk then
				fp:write(chunk)
			end
			if eof then
				fp:close()
			end
		end
	)

-- 备份文件
	if luci.http.formvalue("backup") then
		--
		-- Assemble file list, generate backup
		--
		local reader = ltn12_popen(backup_cmd)
		luci.http.header('Content-Disposition', 'attachment; filename="backup-%s-%s.tar.gz"' % {
			luci.sys.hostname(), os.date("%Y-%m-%d")})
		luci.http.prepare_content("application/x-targz")
		luci.ltn12.pump.all(reader, luci.http.write)
-- 恢复备份
	elseif luci.http.formvalue("restore") then
		--
		-- Unpack received .tar.gz
		--
		local upload = luci.http.formvalue("archive")
		if upload and #upload > 0 then
			luci.template.render("user/applyreboot")
			luci.sys.reboot()
		end
--  刷写固件
	elseif luci.http.formvalue("image") or luci.http.formvalue("step") then
		--
		-- Initiate firmware flash
		--
		local step = tonumber(luci.http.formvalue("step") or 1)
		if step == 1 then
			if image_supported() then
				luci.template.render("user/upgrade", {
					checksum = image_checksum(),
					storage  = storage_size(),
					size     = nixio.fs.stat(image_tmp).size,
					keep     = (not not luci.http.formvalue("keep"))
				})
			else
				nixio.fs.unlink(image_tmp)
				luci.template.render("user/test", {
					reset_avail   = reset_avail,
					upgrade_avail = upgrade_avail,
					image_invalid = true
				})
			end
		--
		-- 进入系统升级处理
		--
		elseif step == 2 then
			local keep = (luci.http.formvalue("keep") == "1") and "" or "-n"
			luci.template.render("user/applyreboot", {
				title = luci.i18n.translate("Flashing..."),
				msg   = luci.i18n.translate("The system is flashing now.<br /> DO NOT POWER OFF THE DEVICE!<br /> Wait a few minutes before you try to reconnect. It might be necessary to renew the address of your computer to reach the device again, depending on your settings."),
				addr  = (#keep > 0) and "192.168.1.1" or nil
			})
			fork_exec("killall dropbear uhttpd; sleep 1; /sbin/sysupgrade %s %q" %{ keep, image_tmp })
		end
	elseif reset_avail and luci.http.formvalue("reset") then
		--
		-- 重置系统
		--
		luci.template.render("user/restore", {
			title = luci.i18n.translate("Erasing..."),
			msg   = luci.i18n.translate("The system is erasing the configuration partition now and will reboot itself when finished."),
			addr  = "192.169.132.1"
		})
		fork_exec("killall dropbear uhttpd; sleep 1; mtd -r erase rootfs_data")
	else
		--
		-- Overview
		--
		luci.template.render("user/test", {
			reset_avail   = reset_avail,
			upgrade_avail = upgrade_avail
		})
	end
end


function fork_exec(command)
	local pid = nixio.fork()
	if pid > 0 then
		return
	elseif pid == 0 then
		-- change to root dir
		nixio.chdir("/")

		-- patch stdin, out, err to /dev/null
		local null = nixio.open("/dev/null", "w+")
		if null then
			nixio.dup(null, nixio.stderr)
			nixio.dup(null, nixio.stdout)
			nixio.dup(null, nixio.stdin)
			if null:fileno() > 2 then
				null:close()
			end
		end

		-- replace with target command
		nixio.exec("/bin/sh", "-c", command)
	end
end

function ltn12_popen(command)

	local fdi, fdo = nixio.pipe()
	local pid = nixio.fork()

	if pid > 0 then
		fdo:close()
		local close
		return function()
			local buffer = fdi:read(2048)
			local wpid, stat = nixio.waitpid(pid, "nohang")
			if not close and wpid and stat == "exited" then
				close = true
			end

			if buffer and #buffer > 0 then
				return buffer
			elseif close then
				fdi:close()
				return nil
			end
		end
	elseif pid == 0 then
		nixio.dup(fdo, nixio.stdout)
		fdi:close()
		fdo:close()
		nixio.exec("/bin/sh", "-c", command)
	end
end