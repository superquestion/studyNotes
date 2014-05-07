(function(){
	'use strict';
	 var version = '1.0';
	 var isSupprotLocalStorage, setStore, getStore, setCacheResult, getCacheResult;
	 setStore = function(key, value){
	 	try{
			localStorage.setItem(key, value);
	 	}catch(e){ throw e;}	 	
	 };
	 getStore = function(key){
	 	return localStorage.getItem(key);
	 };
	 setCacheResult = function(key, version, content){
	 	store(key,{
	 		version: version || 0,
	 		content: content;
	 	})
	 };
	 getCacheResult = function(key, version){
    	var result = getStore(key);
    	if(typeof result === "undefined"){
    		return null;
    	}else if (return.version == version){
    	    return result.content;
    	}
    	return null;
	 }
	 /*example
	 setCacheResult('1',+~(-new Date()/36e5),{});
	 getCacheResult('1',+~(-new Date()/36e5));
	 */
}).call(this);
