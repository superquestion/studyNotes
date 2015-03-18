var controllerManager = {
    curController: null,
    allControllers: {},
    running: "",
    create: function(controller) {
        this.allControllers[controller.__name__] = controller;
        return controller;
    },
    distory: function(controller) {
        delete this.allControllers[controller.__name__];
    },
    isExists: function(name) {
        return !!(name && this.allControllers[name]);
    },
    use: function(name){
        return this.allControllers[name];
    },
    route: function(params){
      //todo     
  }

}
function parseParam(url){
    var str = url.substring(1, url.length);
    if(str == ""){
        return {};
    }
    var arr = str.split("&");
    var params = {};
    for(var i = 0, len = arr.length; i < len; i++){
        var arr1 = arr[i].split("=");
        params[arr1[0]]= arr1[1];
    }
    return params;
}

function onAction() {
    var params = parseParam(location.hash);
    if(!params.hasOwnProperty('c')){
        params.c = "index";
        window.location.hash = "c=index";
    }
    if (controllerManager.isExists(params.c)) {
        controllerManager.curController = controllerManager.use(params.c);
        controllerManager.curController.beforeRoute && controllerManager.curController.beforeRoute();
        if(!controllerManager.curController.route){

            controllerManager.route(params)
        }else{
            controllerManager.curController.route(params);
        }
        controllerManager.curController.afterRoute && controllerManager.curController.afterRoute();

    }
    controllerManager.curController.init = true;
    window.onhashchange = function() {
        onAction();
    }

}
