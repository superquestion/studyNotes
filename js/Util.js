!(function  () {
	return _ = {
		/**
	    限制函数在单位时间内只能执行一次
        @param delay 延迟时间
		@param fn 需要执行的函数
		@immediate 是否立即执行
		@example
		   debounce()
		@return {Fuction} Returns function
		**/
		throttle: function(delay, fn, options) {
    		var context, args, result, previous;
    		var later = function(){
    				previous = new Date().getTime;
    				timeOut = null;
    				result = fn.apply(context, args);
    				context = args = null;
    		}
    		return function(){
    			context = this;
    			args = arguments;
    			var now = new Date().getTime();
    			if(!previous) previous = now;
    			//判断前一个定时器的函数是否执行完毕
    			var wait = delay - (now - previous);
    			if(wait > delay || delay <= 0 ){
    			  clearTimeout(timeOut);
    			  timeOut = null;
    			  previous = now;
    			  result = fn.call(context,args)
    			  context = args = null;

    			}esle if(!timeOut){
    				timeOut = setTimeout(later, delay);
    			}
    			return result;
    		}	

		},
		/**
		将延迟函数的执行(真正的执行)在函数最后一次调用时刻的 wait 毫秒之后
        @param delay 延迟时间
		@param fn 需要执行的函数
		@immediate 是否立即执行
		@example
		   debounce()
		@return {Fuction} Returns function
		**/
		debounce: function  (delay, fn , immediate) {
			var timeOut, args, context, timeTemp, result;
			var later = function(){
				var last;
				last = new Date().getTime - timeTemp;
				//判断两次函数执行的时间差是否小于delay
				//如果小于就放在定时器中延迟执行
				if(last < delay && last > 0){
					timeOut = setTimeout(later,delay - last);//自调
				}else{
					timeOut = null;
					if(!immediate){
						result = fn.apply(context, args);
						context = result = null; //变量的回收
					}
				}
			}
			return function(){
				var context = this, 
				    args = arguments,
                    timeTemp = new Date().getTime();
				    callNow = !timeOut && immediate;
				//首先判断下是否存在定时器
				if(!timeOut){
					timeOut = setTimeout(later,delay);
				}
				//判断是否立即执行
				if(callNow){
					result = fn.apply(context,args);
					context = args = null;
				}
				return result;
			}
		}
	}
})();
