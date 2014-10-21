var baseController = Class.extend({
    init: function(option){
        this.defaultOpt = option;
        this.render();

    },
    template: function(){
       return ttpod.core.getTemplate(this.defaultOpt.template);
    },
    data: function(){
       var result = null;
       if(config.isTest && config.isTest == true){
           $.ajax({
               url: config.domain + 'data/' + this.name + '.json',
               async: false,
               success: function(response){
                   result = response;
               }

           })
       }
        return result;
    },
    render: function(template, data){
        var html = ttpod.core.renderTemplate(this.template(), this.data());
        $("div[data-role='view']").html(html);

    },
    defaultOpt:null
});

var userController = baseController.extend({
     name : "user",
     init:function(){
         var options = {
                 template: {
                     key:"user",
                     url:"tmpl-user"
                 }
            }
         this._super(options);

     }

})