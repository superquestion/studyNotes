/**
 * Created by Administrator on 2014/10/9.
 */
 var Manager = {
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
            url: Ttpod.core.getURI("/Ttpod/test/modules/" + name + "/controller.js"),
            dataType: "script",
            cache: Ttpod.core.isRelease(),
            cacheKey: Ttpod.core.isRelease() ? "controller" + name : "",
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