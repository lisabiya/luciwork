module("luci.controller.admin.demo", package.seeall)  --new_tab¨°a¨®????t??¨°???
function index()
    entry({ "admin", "demo" }, firstchild(), "Demo", 60).dependent = false  --¨¬¨ª?¨®¨°????£¤2?¦Ì?o?
    entry({ "admin", "demo", "demo1" }, template("demo/index"), "demo1", 2)  --?¨²New tab??¨¬¨ª?¨®¨°???¡Á¨®????View Tab
end