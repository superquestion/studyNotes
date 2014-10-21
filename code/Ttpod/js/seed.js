/*
 * Ttpod启动器
 * Ttpod.config设置的优先级:默认设置<全局设置<页面设置
 * <script src="seed.js" data-page="index" data-version="@VERSION@"></script>
 * @return Ttpod.config
 */
var Ttpod = Ttpod || {};
window.__uri = function(uri) {
    return uri;
};
(function(Ttpod, config) {
    var EXP_ATTR = /^data-(\w+)-?(\w+)?/;
    var _scriptsTags = document.getElementsByTagName("script"),
        _curScript = _scriptsTags[_scriptsTags.length - 1];

    function _getArg(key, url, defaultVal) {
        return ((url || location.search).match(new RegExp("(?:\\?|&)" + key + "=(.*?)(?=&|$)")) || ["", defaultVal || ""])[1];
    }

    function _parseAny(val) {
        if (typeof val == 'string') {
            if (val !== "" && !isNaN(val)) {
                val = val - 0;
            } else if (val.toLowerCase() == "true") {
                val = true;
            } else if (val.toLowerCase() == "false") {
                val = false;
            }
        }
        return val;
    }

    function _capitalizeText(str) {
        if ("string" == typeof str) {
            return str.slice(0, 1).toUpperCase() + str.slice(1);
        }
        return "";
    }

    Ttpod.config = (function() {

        // config data-xxx => Ttpod.config.xxx; data-xxx-abc => Ttpod.config.xxxAbc
        for (var i = 0, m = _curScript.attributes.length; i < m; i++) {
            var attr = _curScript.attributes[i],
                akey = attr.name.toLowerCase().match(EXP_ATTR);
            if (akey) {
                config[akey[1] + _capitalizeText(akey[2])] = _parseAny(attr.value);
            }
        }

        // mode(auto|develop|release)
        if (!config.mode || "auto" == config.mode) {
            config.mode = (location.host == config.domain.main ? "release" : "develop");
        }

        // from
        config.from = _getArg("from");

        // pageClass
        var pageClass = "";
        if (config.page) {
            pageClass += " page-" + config.page;
        }
        if (config.from) {
            pageClass += " page-" + config.from;
        }
        if (pageClass) {
            (document.body || document.documentElement).className += pageClass;
        }

        //other

        return config;
    }());

}(Ttpod, {
    "name": "天天动听-内部评测平台",
    "site": "admin-evt-dongting", //站点标识
    "isLog": true, //是否统计日志
    "isProxy": true, //是否启用代理模式,启用后对于跨域的接口要做好服务器代理配置
    "mode": "auto",
    "version": "0.0.0",
    "domain": {
        "lib": "lib.ttdtweb.com",
        "app": "app.ttdtweb.com",
        "main": "admin.evt.dongting.com",
        "data": "api.admin.evt.dongting.com", //"data": "192.168.8.12:8088",
        "ting": "ting.hotchanson.com",
        "file": "192.168.8.12:8088"
    },
    "path": {
        "song": __uri("/assets/images/default/song.png")
    },
    "timeout": 10000,
    "defaultSize": 20,
    "defaultNav": "index",
    "isTest": false
}));
