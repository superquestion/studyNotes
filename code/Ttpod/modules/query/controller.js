$.module(function() {

    Ttpod.controller.createCRUD({
        __name__:"query",
        attrs: {
            name:"query"
        },
        actions: {
            list: "query.show"
        },
        tmpls: {
            list: "modules-query-list"
        }

    });

});