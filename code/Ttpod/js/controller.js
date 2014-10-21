$.module("Ttpod.controller",function(){
    var _isInit = false;
    var EVENT_KEY_SPLITTER = /^(\S+)\s*(.*)$/;

    function _onAction(hash){
        //或得所有的hash
        var params = $.parseParam(location.hash);
        //c 是modules
        params.c = (params.c || 'index').toLowerCase();
        //判断modules是否存在
        if (_controllerManager.isExists(params.c)) {
            //获得modules返回的对象
            _controllerManager.curController = _controllerManager.use(params.c);
            //对应的路由
            _controllerManager.curController.route(params);
        }
    }
    function _capitalizeText(str) {
        if ("string" == typeof str) {
            return str.slice(0, 1).toUpperCase() + str.slice(1);
        }
    }
    //
    var _controllerManager = {
        curController: null,
        allControllers: {},
        create: function(controller) {
            this.allControllers[controller.__name__] = controller;
            return controller;
        },
        distory: function(controller) {
            delete this.allControllers[controller.__name__];
        },
        use: function(name) {
            if (!name) {
                return;
            }
            var that = this;
            var controller = this.allControllers[name];
            if ($.exists(controller)) {
                return controller;
            }

            $.ajax({
                type: "GET",
                url: Ttpod.core.getURI("/Ttpod/modules/" + name + "/controller.js"),
                data: {
                    v: Ttpod.config.assetVersion
                },
                dataType: "script",
                cache: Ttpod.core.isRelease(),
                cacheKey: Ttpod.core.isRelease() ? "controller" + name : "",
                cacheVersion: Ttpod.config.assetVersion,
                async: false,
                error: function() {
                    that.create({
                        __name__: name
                    });
                }
            });

            return this.allControllers[name];
        },
        isExists: function(name) {
            return name && $.exists(this.use(name).status);
        },
        isLoad: function(name) {
            return !!(name && this.allControllers[name]);
        }
    }
    //
    var Controller = $.Class({
        //构造函数
        init: function(opt) {

            var name = opt.__name__;
            //合并到this(当前对象中)
            $.extend(true, this, {
                //属性列表
                attrs: {
                    itemName: "选项",
                    //当前面板的标题
                    url: null,
                    //当前面板的url
                    title: "",
                    inputFormName: name + "InputForm",
                    searchFormName: name + "SearchForm",
                },
                //数据接口的映射
                actions: {},
                //模板Id
                tmpls: {},
                //路由设定
                routes: ["index"],
                // 面板事件
                events: null,
                //权限
                limits: null
            }, opt);

            this.attrs.controller = name;
            //模块状态 undefined init loading loaded failed
            this.status = "init";

            this.trigger("init");
            /**
             * 获取模块属性
             * @param  {[String]} attr [属性名,为空时获取整个对象]
             * @return {Object}      [属性值]
             */
        },
        get: function(attr) {
            if ($.exists(attr)) {
                return this.attrs[attr];
            } else {
                return this.attrs;
            }
        },
        /**
         * 设置模块属性,设置属性时自动触发_onChangeAttr事件
         * @param {String} attr  [属性名]
         * @param {Any} value [属性值]
         */
        set: function(attr, value) {
            if ("string" == typeof attr && attr.length > 0 && this.attrs[attr] != value) {
                this.attrs[attr] = value;
                var fn = this["_onChange" + _capitalizeText(attr)];
                if ($.isFunction(fn)) {
                    fn.call(this, value);
                }
            }
        },
        /**
         * 触发模块事件
         */
        trigger: function(event, data) {
            var fn = this["_on" + _capitalizeText(event)];
            if ($.isFunction(fn)) {
                var args = $.makeArray(arguments);
                args.shift();
                return fn.apply(this, args);
            }
        },
        /**
         * 路由
         */
        route: function(params) {


            if ("route" != params.a && false !== this.trigger('beforeRoute')) {
                //处理参数

                this.resolveParams(params);
            }
            var moduleInfo = this.getModuleInfo(params.a),
                url = location.hash,
                isRoute = url != this.get("url");

            this.set("url", url);
            this.set("title", moduleInfo.name);
            if (isRoute || this.isRefresh) {
                if ($.isFunction(this[params.a])) {

                    this[params.a].call(this, params, 'panel');
                } else {

                    this.index(params, 'panel');
                }
                this.isRefresh = false;
            }
            this.trigger("afterRoute");
        },
        /**
         * 输出action链接
         */
        renderAction: function(a, params) {
            params = $.extend({
                c: this.attrs.controller,
                a: a
            }, params);
            return "#" + $.param(params);
        },
        /**
         * 跳转到指定的action
         */
        gotoAction: function(a, params) {

            var localParams = $.parseParam(location.hash),
                flag = true;

            if(this.attrs.controller==localParams.c && $.isEmptyObject(params)){
                return this.refreshPanel();
            }

            params = $.extend({
                c: this.attrs.controller,
                a: a
            }, params);

            for (var lkey in localParams) {
                if (localParams[lkey] != params[lkey]) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                for (var pkey in params) {
                    if (params[pkey] != localParams[pkey]) {
                        flag = false;
                        break;
                    }
                }
            }
            if (flag) {
                this.refreshPanel();
            } else {
                var isLoad = _controllerManager.isLoad(params.c);
                location.hash = $.param(params);
                if (isLoad) {
                    this.refreshPanel();
                }
            }
        },
        /**
         * 刷新模块面板
         */
        refreshPanel: function() {
            this.isRefresh = true;
            $.history.refreshAction();
        },
        render: function(opt) {

            var $container = opt.$container || $(".container"),
                tmpl = opt.tmpl,
                result = opt.result;
            if (tmpl) {
                if (!$.exists(opt.result)) {

                    $container.html(Ttpod.core.template(tmpl));
                } else {
                    $container.html(Ttpod.common.template(tmpl,result));

                    return;
                }
            } else {
                $container.empty();
            }
        },
        /**
         * 注册面板事件代理
         * 格式为
         * delegateEvents({
         *     'mousedown .J-say': 'edit',
         *     'click .J-open': function(event) { ... }
         * });
         * delegateEvents(".J-search", "click", function(event){});
         * handler中this指向当前controller
         */
        delegateEvents: function() {
            var that = this;
            var args = arguments;
            if (args.length === 0 || $.isEmptyObject(args[0])) {
                return;
            } else if (args.length == 1) {
                var events = args[0];
                if ($.isPlainObject(events)) {
                    for (var eventKey in events) {
                        if (!events.hasOwnProperty(eventKey)) {
                            continue;
                        }
                        var match = eventKey.match(EVENT_KEY_SPLITTER);
                        var handler = events[eventKey];
                        if ("string" == typeof handler && handler) {
                            that.panel.on(match[1], match[2], $.proxy(that[handler], that));
                        } else if ($.isFunction(handler)) {
                            that.panel.on(match[1], match[2], $.proxy(handler, that));
                        }
                    }
                }
            } else if (args.length > 2) {
                if ($.isFunction(args[args.length - 1])) {
                    args[args.length - 1] = $.proxy(args[args.length - 1], that);
                }
                that.panel.delegate(args[0], args[1], args[2], args[3]);
            }
        },
        /**
         * 卸载面板事件代理
         * undelegateEvents(),卸载面板上所有的click事件
         * undelegateEvents(types),卸载面板上所有的types事件
         * undelegateEvents(selector, types, handler)卸载面板的事件
         */
        undelegateEvents: function(selector, types, handler) {
            if (arguments.length === 0) {
                this.panel.off("click");
            } else if (arguments.length == 1) {
                this.panel.off(arguments[0]);
            } else {
                this.panel.off(types, selector, handler);
            }
        },
        getModuleInfo: function(key) {
            if (!key) {
                key = this.get("controller");
            } else if (key.indexOf('.') == -1) {
                key = this.get("controller") + "." + key;
            }

            moduleInfo = {};

            var name = $.isEmptyObject(moduleInfo) ? this.get("name") : moduleInfo.name;
            if (!name) {
                name = $menuList.find('a[href="' + location.hash + '"]').text() || "";
            }
            moduleInfo.name = name;
            return moduleInfo;
        },
        resolveParams: function(params) {
            if ("list" == params.a) {
                params.page = $.isNumeric(params.page) && params.page > 0 ? params.page : 1;
                params.size = $.isNumeric(params.size) && params.size > 0 ? params.page : this.get("size");
            }
            return params;
        },
        resoveResult: function(action, result, params) {
            result = result || {};
            if ('string' == typeof result.params) {
                result.params = JSON.parse(result.params)["params"];
            }
            if (!$.isEmptyObject(params)) {
                result.params = params;
            }

            if (!$.exists(result.params)) {
                result.params = {};
            }

            if (!$.exists(result.data)) {
                result.data = {};
            }


            if (action) {
                result.action = this.getModuleInfo(action);
            }
            result.controller = this;
            return result;
        },
        /**
         * 默认路由
         * 1、#c=controller&a=action,如果action方法不存在就渲染action模板
         * 2、#c=controller&view=模板名称
         */
        index: function(params, type) {
            try {
                var action = params.a || params.view || "index";
                this.trigger('beforeIndex', params);
                this.render({
                    tmpl: 'modules-' + this.get("controller") + '-' + action,
                    result: this.resoveResult(action, {}, params)
                });
                this.trigger('afterIndex', params);

            } catch (ex) {}
        }

    });
    ///CRUD
    var CRUDController = $.Class(Controller, {
        //构造函数
        init: function(opt) {
            var name = opt.__name__;
            this.superclass.init.call(this, $.extend(true, {
                //默认属性
                tmpList: null,
                routes: ["index", "list", "info", "add", "edit", "del"],
                attrs: {
                    primaryKey: "_id"
                },
                events: {

                }
            }, opt));
        },
        //获取model,id=='model'取单个对象的信息
        getModel: function(id, isRefresh) {
            var that = this;
            var model = null;

            if ($.isEmptyObject(this.tmpList)) {
                isRefresh = true;
            }

            if (!isRefresh) {
                if ($.isArray(this.tmpList)) {
                    $.each(this.tmpList, function(i, item) {
                        if (!$.isEmptyObject(item) && item._id == id) {
                            model = item;
                            return false;
                        }
                    });
                } else {
                    if (id == 'model') {
                        model = this.tmpList;
                    }
                }
            }

            if ($.isEmptyObject(model) || isRefresh) {
                var data = {};
                data[this.get("primaryKey")] = id;
                Ttpod.common.getResult({
                    async: false,
                    isTest: that.get("isTest"),
                    action: that.actions.info,
                    data: data,
                    success: function(result) {
                        model = result.data;
                    }
                });
            }

            return $.extend({}, model);
        },
        list: function(params, type) {

            var that = this;
            if (!this.actions.list || !this.tmpls.list) {
                return;
            }
            if (false === that.trigger('beforeList', params)) {
                return;
            }

            Ttpod.common.getResult({
                action: that.actions.list,
                isTest: true,
                data: params,
                success: function(result) {
                    that.tmpList = result.data;
                    that.render({
                        tmpl: that.tmpls.list,
                        result: that.resoveResult(that.actions.list, result)
                    });
                    that.trigger('afterList', result);

                },
                error: function(xhr, status, errorThrown) {

                }
            });
        }

    });
    return {
        init: function() {
            if (_isInit) {
                return;
            }
            $.history.registerAction(_onAction);
            $.history.initActionManager();
            _isInit = true;
        },
        /**
         * 使用controller
         */
        use: function(name) {
            return _controllerManager.use(name);
        },
        /**
         * 创建基础controller
         */
        create: function(opt) {
            if (!opt.__name__) {
                return Ttpod.core.out('controller缺少__name__属性', 'error');
            }
            return _controllerManager.create(new Controller(opt));
        },
        /**
         * 创建CRUDController
         */
        createCRUD: function(opt) {
            if (!opt.__name__) {
                return Ttpod.core.out('controller缺少__name__属性', 'error');
            }
            return _controllerManager.create(new CRUDController(opt));
        },
        refresh: function() {
            $.history.refreshAction();
        }
    };
})

