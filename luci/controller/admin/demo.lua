module("luci.controller.admin.demo", package.seeall)
require "luci.tools.status"
local http = require "luci.http"

function index()
    entry({ "admin", "demo" }, firstchild(), "Demo", 60).dependent = false
    entry({ "admin", "demo", "demo1" }, template("demo/index"), "demo1", 2)
    entry({ "admin", "demo", "demo1", "readDemo" }, call("readDemo"))

    entry({ "admin", "demo", "demo1", "test" }, call("test"))
end

function subTable(tabs, start, ends)
    length = #tabs
    newTabs = {}
    for i, v in ipairs(tabs) do
        if i >= start and i < ends then
            table.insert(newTabs, v)
        end
    end
    return newTabs
end

function readDemo()
    if luci.http.formvalue("status") == "1" then
        local ntm = require "luci.model.network".init()
        local wan = ntm:get_wannet()
        local wan6 = ntm:get_wan6net()

        local conn_count = tonumber((
                luci.sys.exec("wc -l /proc/net/nf_conntrack") or
                        luci.sys.exec("wc -l /proc/net/ip_conntrack") or
                        ""):match("%d+")) or 0

        local conn_max = tonumber((
                luci.sys.exec("sysctl net.nf_conntrack_max") or
                        luci.sys.exec("sysctl net.ipv4.netfilter.ip_conntrack_max") or
                        ""):match("%d+")) or 4096

        local rv = {
            uptime = luci.sys.uptime(),
            localtime = os.date(),
            loadavg = { luci.sys.loadavg() },
            memtotal = memtotal,
            memcached = memcached,
            membuffers = membuffers,
            memfree = memfree,
            swaptotal = swaptotal,
            swapcached = swapcached,
            swapfree = swapfree,
            connmax = conn_max,
            conncount = conn_count,
            leases = luci.tools.status.dhcp_leases(),
            leases6 = subTable(luci.tools.status.dhcp6_leases(), 1, 4),
            wifinets = luci.tools.status.wifi_networks()
        }

        if wan then
            rv.wan = {
                ipaddr = wan:ipaddr(),
                gwaddr = wan:gwaddr(),
                netmask = wan:netmask(),
                dns = wan:dnsaddrs(),
                expires = wan:expires(),
                uptime = wan:uptime(),
                proto = wan:proto(),
                ifname = wan:ifname(),
                link = wan:adminlink()
            }
        end

        if wan6 then
            rv.wan6 = {
                ip6addr = wan6:ip6addr(),
                gw6addr = wan6:gw6addr(),
                dns = wan6:dns6addrs(),
                uptime = wan6:uptime(),
                ifname = wan6:ifname(),
                link = wan6:adminlink()
            }
        end

        if has_dsl then
            local dsl_stat = luci.sys.exec("/etc/init.d/dsl_control lucistat")
            local dsl_func = loadstring(dsl_stat)
            rv.dsl = dsl_func()
        end

        luci.http.prepare_content("application/json")
        luci.http.write_json(rv)
        return
    end
end

function test()
    luci.http.prepare_content("application/json")
    luci.http.write_json("你好")
end
