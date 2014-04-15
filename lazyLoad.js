(function($){
      $.fn.lazyload = function(options){
      	var options = options || {};
      	var defaults = {
      		attr: "data-url",
      		container: $(window),
      		callback:$.noop//这是个空函数 
      	}
      var timer = null, resetTimer = null;
      var params = $.extend({},defaults,options);
          params["container"] = $(this);
          cache = {};
      function init(){
         $("img").each(function () {
                  var element = $(this);
                  if(element.attr(params["attr"]) && element.attr(params["attr"]) != ""){
                       var offset = element.offset();
                       var key = offset.top;
                       if(!cache[key]){
                          cache[key] =[];
                       }
                       cache[key].push(element);
                  }                  
            });   
      }    
      function loading(){
               //var height = params.container.height(),
            var height = $(window).height() + $(window).scrollTop();
          
            for(var i in cache){
                  
                  if(i <= height){
                        var _imgs = cache[i];
                        for(var j = 0, len = _imgs.length; j < len; j++){
                              var img = _imgs[j];
                              var  src = img.attr(params["attr"]);
                              if(src && src != ""){
                                    img.attr("src",src);
                                    img.removeAttr(params["attr"]);
                              }
                        }
                  delete cache[i];      
                  }
            }
      }
      function autoLoad(){
            var key = null;
            for(var i in cache){
                  if(!key){
                        key = i;
                        break;
                  }
            }
            var _imgs = cache[key];
            for(var j = 0, len = _imgs.length; j < len; j++){
                  var img = _imgs[j];
                  var  src = img.attr(params["attr"]);
                  if(src && src != ""){
                        img.attr("src",src);
                        img.removeAttr(params["attr"]);
                  }
            }
            delete cache[key];
            if(timer){
                  clearTimeout(timer)
            }
            timer = setTimeout(autoLoad, 3000);
      }   
      init();
      loading();
      $(window).scroll(function(){
            loading();
      }) ;
      $(window).resize(function(){
            init();
      })  
      //空闲时间开始下载
      $(document).mousemove(function(){
            clearTimeout(timer);
            if(resetTimer){
                  clearTimeout(resetTimer)
            }
            resetTimer = setTimeout(function(){
               autoLoad();
            },5000)
      })    
  }   
})(jQuery)
