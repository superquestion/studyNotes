var Class = (function () {
    var create = function(){
        var baseClass = null,
            parent = arguments[0],
            len = arguments.length,
            methods = arguments[len - 1];
        var init = function(){};
        if(parent){
            if(typeof  parent === "object"){
                methods = parent;
            }else{
                baseClass = parent;
                init = baseClass.prototype.init;
            }
            if (methods.hasOwnProperty('init') && typeof methods.init === 'function') {
                init = methods.init;
            }
        }
        var klass = function() {
           // klass里面this instanceof klass 为true
            if (!(this instanceof klass)) {
                var F = function(args) {
                    return klass.apply(this, args);
                };
                F.prototype = klass.prototype;
                return new F(arguments);
            } else {
                var prevSuper = this._super,
                    that = this;
                this._super = function() {
                    if (baseClass) {
                        baseClass.apply(that, arguments);
                    }
                };
                init.apply(this, arguments);
                this._super = prevSuper;
            }
        };

        if (baseClass) {

            var Intermediate = function() {};
            Intermediate.prototype = baseClass.prototype;
            klass.prototype = new Intermediate();
        }
        for (var method in methods) {
            if (methods.hasOwnProperty(method) && method !== 'init') {
                var parentMethod = klass.prototype[method];
                // klass 的method 是一个你们函数 return function
                klass.prototype[method] = (function(_method, _super) {
                    return function() {
                        var prevSuper = this._super;
                        this._super = _super || function() {};

                        var ret = _method.apply(this, arguments);
                        this._super = prevSuper;

                        return ret;
                    };
                })(methods[method], parentMethod);
            }
        }
        return klass;
    };
    return{
        create: create
    }
})()

/**
  var User = Class.create({
        init:function(name){
           this.name = name;
        },
        say:function(){
         return this.name;
        }
    })
  var  u = new User("james");
  console.log(u.say());

 var Person  = Class.create(User, {
     init:function(name,age){
         this._super(name);
         this.age = age;
     },
     say:function(){
         return this._super() + this.age;
     }

 })
  var p = new Person("kobe",45);
   console.log(p.say())



**/
