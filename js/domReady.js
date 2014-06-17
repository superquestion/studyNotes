var  domReady = function(fn){
		var isReady = false;
		var DOMContentLoaded;
		var readyBound = false;
		var ready = function(){
			//只执行一次
			if(!isReady){
				isReady = true;
				fn();					
			}
			
		}
		//支持DOMContentLoaded
	    if (document.addEventListener) {
            DOMContentLoaded = function() {
                document.removeEventListener('DOMContentLoaded', DOMContentLoaded, false);
                ready();
            };
 		 //ie
        } else if (document.attachEvent) {
            DOMContentLoaded = function() {
                if (document.readyState === 'complete' || document.readyState === 'loaded') {
                    document.detachEvent('onreadystatechange', DOMContentLoaded);
                    ready();
                }
            };
        }
        //执行一次
        var bindReady = function(){
        	if ( readyBound ) {
				return;
			}
			readyBound = true;
        	if (document.addEventListener) {
        		window.addEventListener("DOMContentLoaded",DOMContentLoaded,false);
        		window.addEventListener('load', ready, false);
        	}else if (document.attachEvent) {
        		document.attachEvent( "onreadystatechange", DOMContentLoaded );
        		window.attachEvent('onload', ready);
        		try{
            		var isFrame = window.frameElement != null ;
        		}catch(e){

        		};       
        		if(document.documentElement.doScroll && !isFrame){
            		function tryScroll(){
                		try{
                   		 	document.documentElement.doScroll("left") ;
                   			 ready() ;
               			}catch(e){
                    		setTimeout(tryScroll,10);
                        }
                	}
            	}
            	tryScroll() ;
        	}
        }
        bindReady();
    }
