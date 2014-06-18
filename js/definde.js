/*
  defined("Ttpod.base",function(){})
  defined 里面首先调用 namespace("Ttpod.base");
  这个时候window 中会添加两个对象 window.Ttpod, window.Ttpod.base
  然后调用 namesepace("Ttpod.base",fun)
  此时window.Ttpod != undefined
   obj = window.Ttpod；
  第二次 window.base == undfined
  这时 window.Ttpod.base = fn;
 */

(function() {
    function namespace() {
        var args = arguments, 
        	len = args.length,
        	obj = window,

        	//函数是第二个参数
			fn = (len > 1) ? args[len-1] : undefined,
        	names;
        	//console.log(obj)
        if(len>0){
			names = (args[0]).split('.');

			for (var j = 0, xlen = names.length; j < len; ++j) {
				if(typeof obj[names[j]] == "undefined" && typeof fn !== "undefined"){
					obj = obj[names[j]] = fn;
				} else {

					obj = obj[names[j]] =  {};
				}
			}       
		}
		//console.log(obj)
        return obj;

    }

    function isFunction(obj){
    	return Object.prototype.toString.call(obj) === '[object Function]';
    }
     window.defined = function()  {        
		var len = arguments.length,
			exports,
			name = arguments[0],
            hasName = "string" == typeof name,
        	context = arguments[len-1];

        if(len == 0 || (!hasName && !isFunction(name))){
            return;
        }        
        //只有name
        if(len == 1 && hasName){
            return namespace(name);
        }

        //当参数长度为2,第二个参数是function
        if(hasName){
            exports = {
                __name__:name
            };
            if(isFunction(context)){
                namespace(name, exports);
            }
        }
        //return;
        //调用函数
        if(isFunction(context)){
            context = context.call(exports, exports);

        }
        
        if(hasName){

            if("undefined" == typeof context){
                return exports;
            }

            if( !("__name__" in context)){
                context.__name__ = name;
            }
            /*context 是个fn 返回的对象 Object 如defined("Ttpod.base",function(){
                  return {
	                  init:function(){
	
	                  }
                  }
            })
             context = {init:function(){}}
            */
            return namespace(name, context);
        }

        return context;
    }
}());
