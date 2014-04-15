(function($){
      $.fn.lazyload = function(options){
      	var options = options || {};
      	var defaults = {
      		attr: "data-url",
      		container: $(window),
      		callback:$.noop//这是个空函数 
      	}
      
      var params = $.extend({},defaults,options);
      params.cache = [];
      //循环当前容器中的所有带data-url属性的element

      $(this).each(function(){
	      	var node = this.nodeName.toLowerCase(),
	      	    url = $(this).attr(params["attr"]);
	      	var data = {
		      		element : $(this),
		      		tag: node,
		      		url: url
                }
            params.cache.push(data);    
        })  
      	var callback = function(fn) {
      		if(typeof fn  === "Function"){
      			params.callback.call(fn.get(0));
      		}
      	}

      	var loading  = function(){
      		var containerH = params.container.height(),
      		    containerTop;
      		//获得container 的offsetTop    
            if($(window).get(0) === window){
                containerTop = $(window).scrollTop();
            }else{
            	 containerTop = params.container.offset().top;
            }
            $.each(params.cache, function(i, data){
            	var element = data.element,
            		tag = data.tag,
            		url = data.url,
            		post;
            		if(element){
            			post = element.offset().top - containerTop;
            			post = post + element.height();

            			if(post >=0 && post < containerH){
            				if(url){
            					if (tag === "img") {
            						callback(element.attr("src",url))
            					}
            				 
            				}else{
            					//无地址直接回调
            					callback(element);
            				}
            				data.element = null;
            			} 
            		}
            		
            })
      	};
      	loading();
      	params.container.bind("scroll",loading);
  }
})(jQuery)
