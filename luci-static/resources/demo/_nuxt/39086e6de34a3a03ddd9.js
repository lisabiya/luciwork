(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{182:function(e,t,r){"use strict";var n=Object.prototype.hasOwnProperty,o=Array.isArray,l=function(){for(var e=[],i=0;i<256;++i)e.push("%"+((i<16?"0":"")+i.toString(16)).toUpperCase());return e}(),f=function(source,e){for(var t=e&&e.plainObjects?Object.create(null):{},i=0;i<source.length;++i)void 0!==source[i]&&(t[i]=source[i]);return t};e.exports={arrayToObject:f,assign:function(e,source){return Object.keys(source).reduce((function(e,t){return e[t]=source[t],e}),e)},combine:function(a,b){return[].concat(a,b)},compact:function(e){for(var t=[{obj:{o:e},prop:"o"}],r=[],i=0;i<t.length;++i)for(var n=t[i],l=n.obj[n.prop],f=Object.keys(l),c=0;c<f.length;++c){var d=f[c],v=l[d];"object"==typeof v&&null!==v&&-1===r.indexOf(v)&&(t.push({obj:l,prop:d}),r.push(v))}return function(e){for(;e.length>1;){var t=e.pop(),r=t.obj[t.prop];if(o(r)){for(var n=[],l=0;l<r.length;++l)void 0!==r[l]&&n.push(r[l]);t.obj[t.prop]=n}}}(t),e},decode:function(e,t,r){var n=e.replace(/\+/g," ");if("iso-8859-1"===r)return n.replace(/%[0-9a-f]{2}/gi,unescape);try{return decodeURIComponent(n)}catch(e){return n}},encode:function(e,t,r){if(0===e.length)return e;var n="string"==typeof e?e:String(e);if("iso-8859-1"===r)return escape(n).replace(/%u[0-9a-f]{4}/gi,(function(e){return"%26%23"+parseInt(e.slice(2),16)+"%3B"}));for(var o="",i=0;i<n.length;++i){var f=n.charCodeAt(i);45===f||46===f||95===f||126===f||f>=48&&f<=57||f>=65&&f<=90||f>=97&&f<=122?o+=n.charAt(i):f<128?o+=l[f]:f<2048?o+=l[192|f>>6]+l[128|63&f]:f<55296||f>=57344?o+=l[224|f>>12]+l[128|f>>6&63]+l[128|63&f]:(i+=1,f=65536+((1023&f)<<10|1023&n.charCodeAt(i)),o+=l[240|f>>18]+l[128|f>>12&63]+l[128|f>>6&63]+l[128|63&f])}return o},isBuffer:function(e){return!(!e||"object"!=typeof e)&&!!(e.constructor&&e.constructor.isBuffer&&e.constructor.isBuffer(e))},isRegExp:function(e){return"[object RegExp]"===Object.prototype.toString.call(e)},merge:function e(t,source,r){if(!source)return t;if("object"!=typeof source){if(o(t))t.push(source);else{if(!t||"object"!=typeof t)return[t,source];(r&&(r.plainObjects||r.allowPrototypes)||!n.call(Object.prototype,source))&&(t[source]=!0)}return t}if(!t||"object"!=typeof t)return[t].concat(source);var l=t;return o(t)&&!o(source)&&(l=f(t,r)),o(t)&&o(source)?(source.forEach((function(o,i){if(n.call(t,i)){var l=t[i];l&&"object"==typeof l&&o&&"object"==typeof o?t[i]=e(l,o,r):t.push(o)}else t[i]=o})),t):Object.keys(source).reduce((function(t,o){var l=source[o];return n.call(t,o)?t[o]=e(t[o],l,r):t[o]=l,t}),l)}}},183:function(e,t,r){"use strict";var n=String.prototype.replace,o=/%20/g;e.exports={default:"RFC3986",formatters:{RFC1738:function(e){return n.call(e,o,"+")},RFC3986:function(e){return e}},RFC1738:"RFC1738",RFC3986:"RFC3986"}},185:function(e,t,r){"use strict";var n=r(186),o=r(187),l=r(183);e.exports={formats:l,parse:o,stringify:n}},186:function(e,t,r){"use strict";var n=r(182),o=r(183),l=Object.prototype.hasOwnProperty,f={brackets:function(e){return e+"[]"},comma:"comma",indices:function(e,t){return e+"["+t+"]"},repeat:function(e){return e}},c=Array.isArray,d=Array.prototype.push,v=function(e,t){d.apply(e,c(t)?t:[t])},m=Date.prototype.toISOString,h={addQueryPrefix:!1,allowDots:!1,charset:"utf-8",charsetSentinel:!1,delimiter:"&",encode:!0,encoder:n.encode,encodeValuesOnly:!1,formatter:o.formatters[o.default],indices:!1,serializeDate:function(e){return m.call(e)},skipNulls:!1,strictNullHandling:!1},y=function e(object,t,r,o,l,f,filter,d,m,y,x,w,O){var _=object;if("function"==typeof filter?_=filter(t,_):_ instanceof Date?_=y(_):"comma"===r&&c(_)&&(_=_.join(",")),null===_){if(o)return f&&!w?f(t,h.encoder,O):t;_=""}if("string"==typeof _||"number"==typeof _||"boolean"==typeof _||n.isBuffer(_))return f?[x(w?t:f(t,h.encoder,O))+"="+x(f(_,h.encoder,O))]:[x(t)+"="+x(String(_))];var S,j=[];if(void 0===_)return j;if(c(filter))S=filter;else{var P=Object.keys(_);S=d?P.sort(d):P}for(var i=0;i<S.length;++i){var k=S[i];l&&null===_[k]||(c(_)?v(j,e(_[k],"function"==typeof r?r(t,k):t,r,o,l,f,filter,d,m,y,x,w,O)):v(j,e(_[k],t+(m?"."+k:"["+k+"]"),r,o,l,f,filter,d,m,y,x,w,O)))}return j};e.exports=function(object,e){var t,r=object,n=function(e){if(!e)return h;if(null!==e.encoder&&void 0!==e.encoder&&"function"!=typeof e.encoder)throw new TypeError("Encoder has to be a function.");var t=e.charset||h.charset;if(void 0!==e.charset&&"utf-8"!==e.charset&&"iso-8859-1"!==e.charset)throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");var r=o.default;if(void 0!==e.format){if(!l.call(o.formatters,e.format))throw new TypeError("Unknown format option provided.");r=e.format}var n=o.formatters[r],filter=h.filter;return("function"==typeof e.filter||c(e.filter))&&(filter=e.filter),{addQueryPrefix:"boolean"==typeof e.addQueryPrefix?e.addQueryPrefix:h.addQueryPrefix,allowDots:void 0===e.allowDots?h.allowDots:!!e.allowDots,charset:t,charsetSentinel:"boolean"==typeof e.charsetSentinel?e.charsetSentinel:h.charsetSentinel,delimiter:void 0===e.delimiter?h.delimiter:e.delimiter,encode:"boolean"==typeof e.encode?e.encode:h.encode,encoder:"function"==typeof e.encoder?e.encoder:h.encoder,encodeValuesOnly:"boolean"==typeof e.encodeValuesOnly?e.encodeValuesOnly:h.encodeValuesOnly,filter:filter,formatter:n,serializeDate:"function"==typeof e.serializeDate?e.serializeDate:h.serializeDate,skipNulls:"boolean"==typeof e.skipNulls?e.skipNulls:h.skipNulls,sort:"function"==typeof e.sort?e.sort:null,strictNullHandling:"boolean"==typeof e.strictNullHandling?e.strictNullHandling:h.strictNullHandling}}(e);"function"==typeof n.filter?r=(0,n.filter)("",r):c(n.filter)&&(t=n.filter);var d,m=[];if("object"!=typeof r||null===r)return"";d=e&&e.arrayFormat in f?e.arrayFormat:e&&"indices"in e?e.indices?"indices":"repeat":"indices";var x=f[d];t||(t=Object.keys(r)),n.sort&&t.sort(n.sort);for(var i=0;i<t.length;++i){var w=t[i];n.skipNulls&&null===r[w]||v(m,y(r[w],w,x,n.strictNullHandling,n.skipNulls,n.encode?n.encoder:null,n.filter,n.sort,n.allowDots,n.serializeDate,n.formatter,n.encodeValuesOnly,n.charset))}var O=m.join(n.delimiter),_=!0===n.addQueryPrefix?"?":"";return n.charsetSentinel&&("iso-8859-1"===n.charset?_+="utf8=%26%2310003%3B&":_+="utf8=%E2%9C%93&"),O.length>0?_+O:""}},187:function(e,t,r){"use strict";var n=r(182),o=Object.prototype.hasOwnProperty,l={allowDots:!1,allowPrototypes:!1,arrayLimit:20,charset:"utf-8",charsetSentinel:!1,comma:!1,decoder:n.decode,delimiter:"&",depth:5,ignoreQueryPrefix:!1,interpretNumericEntities:!1,parameterLimit:1e3,parseArrays:!0,plainObjects:!1,strictNullHandling:!1},f=function(e){return e.replace(/&#(\d+);/g,(function(e,t){return String.fromCharCode(parseInt(t,10))}))},c=function(e,t,r){if(e){var n=r.allowDots?e.replace(/\.([^.[]+)/g,"[$1]"):e,l=/(\[[^[\]]*])/g,f=/(\[[^[\]]*])/.exec(n),c=f?n.slice(0,f.index):n,d=[];if(c){if(!r.plainObjects&&o.call(Object.prototype,c)&&!r.allowPrototypes)return;d.push(c)}for(var i=0;null!==(f=l.exec(n))&&i<r.depth;){if(i+=1,!r.plainObjects&&o.call(Object.prototype,f[1].slice(1,-1))&&!r.allowPrototypes)return;d.push(f[1])}return f&&d.push("["+n.slice(f.index)+"]"),function(e,t,r){for(var n=t,i=e.length-1;i>=0;--i){var o,l=e[i];if("[]"===l&&r.parseArrays)o=[].concat(n);else{o=r.plainObjects?Object.create(null):{};var f="["===l.charAt(0)&&"]"===l.charAt(l.length-1)?l.slice(1,-1):l,c=parseInt(f,10);r.parseArrays||""!==f?!isNaN(c)&&l!==f&&String(c)===f&&c>=0&&r.parseArrays&&c<=r.arrayLimit?(o=[])[c]=n:o[f]=n:o={0:n}}n=o}return n}(d,t,r)}};e.exports=function(e,t){var r=function(e){if(!e)return l;if(null!==e.decoder&&void 0!==e.decoder&&"function"!=typeof e.decoder)throw new TypeError("Decoder has to be a function.");if(void 0!==e.charset&&"utf-8"!==e.charset&&"iso-8859-1"!==e.charset)throw new Error("The charset option must be either utf-8, iso-8859-1, or undefined");var t=void 0===e.charset?l.charset:e.charset;return{allowDots:void 0===e.allowDots?l.allowDots:!!e.allowDots,allowPrototypes:"boolean"==typeof e.allowPrototypes?e.allowPrototypes:l.allowPrototypes,arrayLimit:"number"==typeof e.arrayLimit?e.arrayLimit:l.arrayLimit,charset:t,charsetSentinel:"boolean"==typeof e.charsetSentinel?e.charsetSentinel:l.charsetSentinel,comma:"boolean"==typeof e.comma?e.comma:l.comma,decoder:"function"==typeof e.decoder?e.decoder:l.decoder,delimiter:"string"==typeof e.delimiter||n.isRegExp(e.delimiter)?e.delimiter:l.delimiter,depth:"number"==typeof e.depth?e.depth:l.depth,ignoreQueryPrefix:!0===e.ignoreQueryPrefix,interpretNumericEntities:"boolean"==typeof e.interpretNumericEntities?e.interpretNumericEntities:l.interpretNumericEntities,parameterLimit:"number"==typeof e.parameterLimit?e.parameterLimit:l.parameterLimit,parseArrays:!1!==e.parseArrays,plainObjects:"boolean"==typeof e.plainObjects?e.plainObjects:l.plainObjects,strictNullHandling:"boolean"==typeof e.strictNullHandling?e.strictNullHandling:l.strictNullHandling}}(t);if(""===e||null==e)return r.plainObjects?Object.create(null):{};for(var d="string"==typeof e?function(e,t){var i,r={},c=t.ignoreQueryPrefix?e.replace(/^\?/,""):e,d=t.parameterLimit===1/0?void 0:t.parameterLimit,v=c.split(t.delimiter,d),m=-1,h=t.charset;if(t.charsetSentinel)for(i=0;i<v.length;++i)0===v[i].indexOf("utf8=")&&("utf8=%E2%9C%93"===v[i]?h="utf-8":"utf8=%26%2310003%3B"===v[i]&&(h="iso-8859-1"),m=i,i=v.length);for(i=0;i<v.length;++i)if(i!==m){var y,x,w=v[i],O=w.indexOf("]="),_=-1===O?w.indexOf("="):O+1;-1===_?(y=t.decoder(w,l.decoder,h),x=t.strictNullHandling?null:""):(y=t.decoder(w.slice(0,_),l.decoder,h),x=t.decoder(w.slice(_+1),l.decoder,h)),x&&t.interpretNumericEntities&&"iso-8859-1"===h&&(x=f(x)),x&&t.comma&&x.indexOf(",")>-1&&(x=x.split(",")),o.call(r,y)?r[y]=n.combine(r[y],x):r[y]=x}return r}(e,r):e,v=r.plainObjects?Object.create(null):{},m=Object.keys(d),i=0;i<m.length;++i){var h=m[i],y=c(h,d[h],r);v=n.merge(v,y,r)}return n.compact(v)}},188:function(e,t,r){"use strict";r(124),r(20);var n=r(189),o=r.n(n),l=r(185),f=r.n(l),c={SITE_INFO:{name:"后台"},REQUEST_TIME_OUT:1e4,API_ROOT:"http://175.24.128.25:8090/",SOURCE_CODE:{}};o.a.defaults.timeout=c.REQUEST_TIME_OUT,o.a.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded;charset=UTF-8",o.a.defaults.baseURL=c.API_ROOT,o.a.interceptors.request.use((function(e){return"post"==e.method&&(e.headers["content-type"]="application/x-www-form-urlencoded;charset=UTF-8",e.data=f.a.stringify(e.data)),e.method,e}),(function(e){return console.log("错误的传参"),Promise.reject(e)}));var d={post:function(e,t,r){return e=c[r]||""+e,new Promise((function(r,n){o.a.post(e,t).then((function(e){r(e)}),(function(e){n(e)})).catch((function(e){n(e)}))}))},get:function(e,param,t){return e=c[t]||""+e,new Promise((function(t,r){o.a.get(e,{params:param}).then((function(e){t(e)}),(function(e){r(e)})).catch((function(e){r(e)}))}))}},v={getAlluser:"POST api/account/getAllUser",getUserinf:"POST api/account/getUser",addUser:"POST api/account/mergeUser",getAllserver:"POST api/account/getAllServer",getServerinf:"POST api/account/getServer",addServer:"POST api/account/mergeServer"},m={},h=function(e){var t=e.split(" "),r="get",n=e;return 2===t.length&&(r=t[0],n=t[1]),function(e){return"POST"==r?d.post(n,e):"JSONP"==r?d.ajax(n,e):d.get(n,e)}};for(var y in v)m[y]=h(v[y]);t.a=m},191:function(e,t,r){var content=r(224);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,r(54).default)("6126db6b",content,!0,{sourceMap:!1})},223:function(e,t,r){"use strict";var n=r(191);r.n(n).a},224:function(e,t,r){(t=r(53)(!1)).push([e.i,'.information[data-v-33fffad1]{width:100%;min-width:1200px;position:relative;padding-bottom:50px}.information>h1[data-v-33fffad1]{text-align:center;letter-spacing:1px;padding:30px 0;color:#fff;background:#8db9ff}.information .serveInf[data-v-33fffad1]{display:flex;justify-content:center;width:100%;padding:40px 0}.information .serveInf .left[data-v-33fffad1]{width:600px}.information .serveInf .left .item[data-v-33fffad1]{width:100%;height:50px;margin:10px 0}.information .serveInf .left .item>span[data-v-33fffad1]{display:inline-block;vertical-align:middle;color:#378eff;font-size:20px;letter-spacing:1px;font-weight:500;width:120px;height:50px;text-align:center}.information .serveInf .left .item>input[data-v-33fffad1]{display:inline-block;vertical-align:middle;height:50px;width:380px;border:1px solid #8db9ff;text-indent:16px;background:#eaf3ff;margin-left:30px}.information .serveInf .right[data-v-33fffad1]{width:600px}.information .serveInf .right>span[data-v-33fffad1]{display:block;width:150px;height:50px;text-align:center;line-height:50px;color:#fff;background:#378eff;border-radius:10px;cursor:pointer;letter-spacing:1px;font-size:18px;margin:0 auto}.information .serveInf .right .item[data-v-33fffad1]{width:100%;height:50px;margin:10px 0}.information .serveInf .right .item>span[data-v-33fffad1]{display:inline-block;vertical-align:middle;color:#378eff;font-size:20px;letter-spacing:1px;font-weight:500;width:120px;height:50px;text-align:center}.information .serveInf .right .item>input[data-v-33fffad1]{display:inline-block;vertical-align:middle;height:50px;width:380px;border:1px solid #8db9ff;text-indent:16px;background:#eaf3ff;margin-left:30px}.information .serve[data-v-33fffad1]{width:100%;padding:50px 0;display:flex;justify-content:center}.information .serve .selfServe[data-v-33fffad1]{width:420px;min-height:420px;background:#eaf3ff;border:1px solid #8db9ff;border-radius:5px;margin:10px;position:relative}.information .serve .selfServe>span[data-v-33fffad1]{display:block;width:300px;margin:15px auto;text-align:center;background:#8db9ff;color:#fff;font-size:20px;letter-spacing:1px;border-radius:5px;height:40px;line-height:40px;cursor:pointer}.information .serve .selfServe[data-v-33fffad1]:before{content:"拥有的用户";display:block;position:absolute;width:100%;text-align:center;color:#8db9ff;font-size:30px;letter-spacing:1px;font-weight:600;top:-60px}.information .serve .allServe[data-v-33fffad1]{width:420px;min-height:420px;background:#eaf3ff;border:1px solid #8db9ff;border-radius:5px;margin:10px;position:relative}.information .serve .allServe>span[data-v-33fffad1]{display:block;width:300px;margin:15px auto;text-align:center;background:#8db9ff;color:#fff;font-size:20px;letter-spacing:1px;border-radius:5px;height:40px;line-height:40px;cursor:pointer}.information .serve .allServe[data-v-33fffad1]:before{content:"所有的用户";display:block;position:absolute;letter-spacing:1px;font-weight:600;top:-60px}.information .serve .allServe[data-v-33fffad1]:before,.information>h6[data-v-33fffad1]{width:100%;text-align:center;color:#8db9ff;font-size:30px}.information .ip[data-v-33fffad1]{width:860px;display:block;min-height:420px;background:#eaf3ff;margin:20px auto;position:relative;border:1px solid #8db9ff;border-radius:5px;text-indent:16px;resize:none}',""]),e.exports=t},236:function(e,t,r){"use strict";r.r(t);r(41),r(55),r(38),r(57),r(56),r(42),r(39),r(40),r(20);var n=r(188);function o(e){if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(e=function(e,t){if(!e)return;if("string"==typeof e)return l(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return l(e,t)}(e))){var i=0,t=function(){};return{s:t,n:function(){return i>=e.length?{done:!0}:{done:!1,value:e[i++]}},e:function(e){throw e},f:t}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,n,o=!0,f=!1;return{s:function(){r=e[Symbol.iterator]()},n:function(){var e=r.next();return o=e.done,e},e:function(e){f=!0,n=e},f:function(){try{o||null==r.return||r.return()}finally{if(f)throw n}}}}function l(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,r=new Array(t);i<t;i++)r[i]=e[i];return r}var f={data:function(){return{path:"",serveraddress:"",servername:"",serverpassword:"",servertitle:"",testaddress:"",testname:"",testpassword:"",testtitle:"",ipList:[],str:"",userList:[],allUser:{}}},methods:{getUser:function(){var e=this;n.a.getAlluser({}).then((function(t){e.allUser=t.data.data}))},saveInf:function(){var e=this,t="";this.userList.forEach((function(e,i){t+=e+","})),n.a.addServer({path:this.path,officialDomain:this.serveraddress,officialUser:this.servername,officialPassword:this.serverpassword,officialDb:this.servertitle,testDomain:this.testaddress,testUser:this.testname,testPassword:this.testpassword,testDb:this.testtitle,userList:t,ipList:this.str}).then((function(t){"200"==t.data.code?e.$router.go(0):alert(t.data.msg)}))},getInf:function(){var e=this,path=this.$route.query.path;n.a.getServerinf({path:path}).then((function(t){e.path=t.data.data.path,e.serveraddress=t.data.data.official_domain,e.servername=t.data.data.official_user,e.serverpassword=t.data.data.official_password,e.servertitle=t.data.data.official_db,e.testaddress=t.data.data.test_domain,e.testname=t.data.data.test_user,e.testpassword=t.data.data.test_password,e.testtitle=t.data.data.test_db,t.data.data.userList&&(e.userList=t.data.data.userList),t.data.data.ipList&&(e.ipList=t.data.data.ipList,e.ipList.forEach((function(t,i){e.str+=t+","})))}))},addUser:function(e){var t,r=o(this.userList);try{for(r.s();!(t=r.n()).done;){if(t.value==e)return void alert("请勿重复添加")}}catch(e){r.e(e)}finally{r.f()}this.userList.push(e)},removeUser:function(i){this.userList.splice(i,1)}},mounted:function(){this.getInf(),this.getUser()}},c=(r(223),r(27)),component=Object(c.a)(f,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"information"},[r("h1",[e._v("添加编辑服务")]),e._v(" "),r("div",{staticClass:"serveInf"},[r("div",{staticClass:"left"},[r("div",{staticClass:"item"},[r("span",[e._v("path")]),e._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.path,expression:"path"}],attrs:{type:"text"},domProps:{value:e.path},on:{input:function(t){t.target.composing||(e.path=t.target.value)}}})]),e._v(" "),r("div",{staticClass:"item"},[r("span",[e._v("正式服地址")]),e._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.serveraddress,expression:"serveraddress"}],attrs:{type:"text"},domProps:{value:e.serveraddress},on:{input:function(t){t.target.composing||(e.serveraddress=t.target.value)}}})]),e._v(" "),r("div",{staticClass:"item"},[r("span",[e._v("正式服服务器用户名")]),e._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.servername,expression:"servername"}],attrs:{type:"text"},domProps:{value:e.servername},on:{input:function(t){t.target.composing||(e.servername=t.target.value)}}})]),e._v(" "),r("div",{staticClass:"item"},[r("span",[e._v("正式服服务器密码")]),e._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.serverpassword,expression:"serverpassword"}],attrs:{type:"text"},domProps:{value:e.serverpassword},on:{input:function(t){t.target.composing||(e.serverpassword=t.target.value)}}})]),e._v(" "),r("div",{staticClass:"item"},[r("span",[e._v("正式服服务器名称")]),e._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.servertitle,expression:"servertitle"}],attrs:{type:"text"},domProps:{value:e.servertitle},on:{input:function(t){t.target.composing||(e.servertitle=t.target.value)}}})])]),e._v(" "),r("div",{staticClass:"right"},[r("div",{staticClass:"item"},[r("span",[e._v("测试服地址")]),e._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.testaddress,expression:"testaddress"}],attrs:{type:"text"},domProps:{value:e.testaddress},on:{input:function(t){t.target.composing||(e.testaddress=t.target.value)}}})]),e._v(" "),r("div",{staticClass:"item"},[r("span",[e._v("测试服服务器用户名")]),e._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.testname,expression:"testname"}],attrs:{type:"text"},domProps:{value:e.testname},on:{input:function(t){t.target.composing||(e.testname=t.target.value)}}})]),e._v(" "),r("div",{staticClass:"item"},[r("span",[e._v("测试服服务器密码")]),e._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.testpassword,expression:"testpassword"}],attrs:{type:"text"},domProps:{value:e.testpassword},on:{input:function(t){t.target.composing||(e.testpassword=t.target.value)}}})]),e._v(" "),r("div",{staticClass:"item"},[r("span",[e._v("测试服服务器名称")]),e._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.testtitle,expression:"testtitle"}],attrs:{type:"text"},domProps:{value:e.testtitle},on:{input:function(t){t.target.composing||(e.testtitle=t.target.value)}}})]),e._v(" "),r("span",{on:{click:function(t){return e.saveInf()}}},[e._v("保存")])])]),e._v(" "),r("div",{staticClass:"serve"},[r("div",{staticClass:"selfServe"},e._l(e.userList,(function(t,i){return r("span",{key:i,on:{click:function(t){return e.removeUser(i)}}},[e._v(e._s(t))])})),0),e._v(" "),r("div",{staticClass:"allServe"},e._l(e.allUser,(function(t,i){return r("span",{key:i,on:{click:function(r){return e.addUser(t.username)}}},[e._v(e._s(t.username))])})),0)]),e._v(" "),r("h6",[e._v("IP白名单")]),e._v(" "),r("textarea",{directives:[{name:"model",rawName:"v-model",value:e.str,expression:"str"}],staticClass:"ip",domProps:{value:e.str},on:{input:function(t){t.target.composing||(e.str=t.target.value)}}})])}),[],!1,null,"33fffad1",null);t.default=component.exports}}]);