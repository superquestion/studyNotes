var Aop = {
    /*
    * @param target
    * @param method
    * @param fn
    * */
    before:function(target, method, fn){
        var original = target[method];
        target[method] = function(){
            fn();
            original.apply(target,arguments);
        }
        return target;

    },
    after:function(target, method, fn){

        var original = target[method];
        target[method] = function(){
            original.apply(target,arguments);
            fn();
        }
        return target;
    },
    around:function(target, method, fn){
        var original = target[method];
        target[method] = function(){
            fn();
            original.apply(target,arguments);
            fn();
        }
        return target;
    }

}

//function Person(){
//
//}
//
//Person.prototype.say = function(name){
//    console.log("hello:" + name);
//}
//var p = new Person();
//Aop.before(p, 'say', function(){
//    console.log("before")
//})
//p.say("kkkk");
