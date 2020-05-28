local lpeg = require "lpeg"
local P = lpeg.P
local S = lpeg.S
local match = lpeg.match
local json = require("json")

function testP()
    -- value是string的情况
    local ps = P('ab')
    print("pn0***", match(ps, "a"))
    ---> nil
    print("pn0***", match(ps, "abcdabcd"))  ---> 3  注：只匹配"ab"

    -- value是非负整数
    -- 注：完全匹配任意value个字符
    local pn1 = P(3)
    -- local pn1 = P(3.0)  -- 这样也是可以的
    print("pn1***", match(pn1, "12"))
    ---> nil  注：只有2个字符
    print("pn1***", match(pn1, "abcd"))  ---> 4

    -- 注：value不能是小数，但是小数部分为0是可以的
    -- 如果是小数，总是返回1
    local pn2 = P(2.1)
    print("pn2***", match(pn2, "22"))  ---> 1

    -- value是负整数
    -- 被匹配的字符串长度要小于value
    local pn3 = P(-4)  -- 等价于  local pn3 = - P(3)
    print("pn3***", match(pn3, "abcd"))
    ---> nil  注：字符串长度>=3了
    print("pn3***", match(pn3, "ab"))
    ---> 1
    print("pn3***", match(pn3, ""))  ---> 1

    -- value是boolean
    local pb1 = P(true)
    local str1 = "aaa"  -- str1为任意字符串
    print("pb1***", match(pb1, str1))  ---> 1  注：当value为true时，不管str1是什么字符串，始终返回1

    local pb2 = P(false)
    local str2 = "aaa"  -- str2为任意字符串
    print("pb2***", match(pb2, str2))  ---> nil  注：当value为false时，不管str2是什么字符串，始终返回nil

    -- value是table
    local Cs = lpeg.Cs
    local m1 = Cs((P(1) / { a = 1, b = 2, c = 3 }) ^ 0)
    print("cs1***", match(m1, "abcabcbcccc"))  ---> 123

    -- value是function
    -- 请跳到match-time capture(lpeg.Cmt)


end
function testB()
    local B = lpeg.B

    local m1 = B "love"
    local m2 = 1 * m1
    local m3 = 1 * B "b"

    print(match(m1, "love"))
    ---> nil
    print(match(m2, "love lua"))
    ---> 2
    print(match(m3, "a"))  ---> nil

    -- 注：这里的m3和m2的区别就是一个是a，一个是b，但得到的结果不一样

    local m4 = B(1)
    local m5 = 1 * m4

    print("m4", match(m4, "a"))
    ---> nil
    print("m5", match(m5, "a"))
    ---> 2
    print(match(-m4, "a"))  ---> nil

    local m6 = B(250)
    local m7 = 250 * m6

    print(match(m6, string.rep("a", 250)))
    ---> nil
    print(match(m7, string.rep("a", 250)))  ---> 251

    print(string.rep("a", 3, "."))
end

function custom()
    local ps = P('ab')
    local ps1 = P('"')
    print(match(ps1 ^ 1 * ps ^ 1 * ps1 ^ 1, '"ab"'))
    print(type(ps1), tostring(ps1))
end
custom()
--testP()
--testB()
