module("luci.controller.admin.demo", package.seeall)  --new_tab��a��????t??��???
function index()
    entry({ "admin", "demo" }, firstchild(), "Demo", 60).dependent = false  --����?����????��2?��?o?
    entry({ "admin", "demo", "demo1" }, template("demo/index"), "demo1", 2)  --?��New tab??����?����???����????View Tab
end