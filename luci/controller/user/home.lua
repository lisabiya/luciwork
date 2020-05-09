module("luci.controller.user.home", package.seeall)

function index()
	entry({"user", "home"}, alias("user", "home", "home"), _("Home"), 30).index = true
	entry({"user", "home","home"}, template("user/home"), _("Home"), 1)

end

-- function set_hostname()

-- 　　local hostname = luci.http.formvalue("hostname")

-- 　　local executeString = "uci set system.@system[0].hostname="..hostname

-- 　　luci.sys.exec(executeString)

-- end