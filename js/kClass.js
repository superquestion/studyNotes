
var initializing = false;
function kClass(baseClass, prop) {

// 只接受一个参数的情况 - jClass(prop)

    if (typeof (baseClass) === "object") {

        prop = baseClass;

        baseClass = null;

    }

// 本次调用所创建的类（构造函数）

    function F() {


        // 这就提供了在实例对象中调用父类方法的途径
        //储存base的原型
        if (baseClass) {

            this.baseprototype = baseClass.prototype;

        }
        // 如果当前处于实例化类的阶段，则调用init原型函数
        if (!initializing) {
            this.init.apply(this, arguments);

        }

    }

// 如果此类需要从其它类扩展

    if (baseClass) {


        initializing = true;

        //继承基类
        F.prototype = new baseClass();

        F.prototype.constructor = F;

        initializing = false;

    }

// 覆盖父类的同名函数

    for (var name in prop) {

        if (prop.hasOwnProperty(name)) {
            //当基类存在，并且子类存在和父类同名的方法
            if(baseClass &&  typeof (prop[name]) === "function" && typeof (F.prototype[name]) === "function"){
                F.prototype[name] =  (function(name, fn){
                    return  function(){
                       this.base = baseClass.prototype[name];
                       return fn.apply(this, arguments);
                    }
                })(name, prop[name])
            }else{
                F.prototype[name] = prop[name];
            }



        }

    }

    return F;

};
