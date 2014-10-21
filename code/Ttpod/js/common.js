/**
 * 业务公共模块
 */
$.module('Ttpod.common', function() {

    Ttpod.core.setOptions({
        tmplPrefix: "Ttpod-modules-",
        dataFormat: false
    });

    //通用处理错误
    Ttpod.core.setErrorHandler({
        0: function(error) {
            try {
                if ('service' == error.errorThrown) {
                    Ttpod.ui.alert(JSON.stringify(error.msg), '服务异常-' + error.code, 'error');
                } else {
                    Ttpod.ui.alert("网络异常,请稍候访问!", '网络异常', 'error');
                }
            } catch (ex) {}
        },
        30001: {
            msg: "xxx",
            handler: function(error) {
                alert("");
            }
        }
    });

    //处理一下

    function _resolveResultOpt(opt, type) {
        if (!opt.url) {
            //测试数据
            if (Ttpod.config.isTest || opt.isTest) {
                if (type == "get") {
                    opt.url = Ttpod.core.getURI("/Ttpod/data/" + opt.action.replace('.', '/') + ".json", "", new Date().getTime());
                } else {
                    opt.url = Ttpod.core.getURI("/data/default.json");
                }
            } else {
                opt.url = Ttpod.core.resolveAction({
                    path: "/" + opt.action.replace(/\./g, '/') + '.do',
                    domain: Ttpod.config.domain.data
                });
            }
        }
        if (!("cache" in opt)) {
            opt.cache = false;
        }
        console.log(opt);
        return opt;

    }

    return {
        /*
         * 获取数据
         */
        getResult: function(opt) {
            Ttpod.core.getResult(_resolveResultOpt(opt, 'get'));
        },
        /**
         * 修改数据
         */
        setResult: function(opt) {
            Ttpod.core.setResult(_resolveResultOpt(opt, 'set'));
        },
        getPicByMsgId: function(msgid, type) {
            if (!msgid) {
                return "";
            }
            var res;
            this.getResult({
                action: "common.getpic",
                data: {
                    msgid: msgid
                },
                async: false,
                success: function(result) {
                    res = result.data[type];
                }
            });
            return res;
        },
        getSongBySongId: function(songId, callback) {
            this.getResult({
                url: Ttpod.core.resolveAction({
                    isProxy: false,
                    domain: Ttpod.config.domain.ting,
                    path: "/detail.do"
                }),
                data: {
                    neid: songId
                },
                success: function(result) {
                    callback(result.data);
                },
                error: function() {
                    callback(null);
                }
            });
        },
        template:function(tpl,result){
            var url = ""+tpl.replace(/-/g, "/") + ".html";

            $.ajax({
                url: url,
                async: false,
                dataType: "html",
                success: function(result) {
                    fn = $.template(result);
                    //console.log(fn)
                }
            });
            if (fn) {

                return fn(result);
            }
        }

    };
});


/*
 * Ttpod.enumList
 */
$.module("Ttpod.enumList", function() {


    this.project = {
        status: {
            "0": "待抓取",
            "1": "未完成抓取",
            "2": "已完成抓取",
            "3": "评估完成"
        },
        type: {
            "0": "DCG",
            "1": "SBS"
        },
        eb_type: {
            "0": "自身产品评测",
            "1": "竞品对比评测"
        }
    };




});
