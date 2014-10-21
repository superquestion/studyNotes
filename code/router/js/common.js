(function(exports){
     var templates = {};
     function resolveTmplPath(url){
         if(!url){
             return;
         }
         var path = url.split("-");
         return path.join("/") + ".html";
     }
     /*
      @param key 唯一标识
      @param url  template 路径
      @return string
     * */
     function getTemplate(option){
         var key = option.key,
             url = option.url;
         if(templates[key]){
             return templates[key];
         }
         var url = config.domain + resolveTmplPath(url);
         $.ajax({
             type: 'GET',
             url: url,
             timeout: 1000,
             async:false,
             success: function(response){
                templates[key] = response;
             },
             error: function(xhr, type){
                 throw "template load failed";
             }
         })
        return templates[key];
     }
    /*
     @param template handlebars template
     @param data  data model
     @return string
     * */
    function renderTemplate(source, data){
        var template = Handlebars.compile(source);
        var html = template(data);
        return html;
    }
    exports.ttpod = {};
    exports.ttpod.core = {};
    exports.ttpod.core ={
        getTemplate: getTemplate ,
        renderTemplate: renderTemplate
    };
})(window)