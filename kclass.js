var klass = function (Parent, props) {

    var Child, F, i;
    //uber属性，这个属性直接指向父对象的prototype属性
   //如果child存在，并且有construct,则调用child的父类构造函数
    Child = function () {
        if (Child.uber && Child.uber.hasOwnProperty("__construct")) {
            Child.uber.__construct.apply(this, arguments);
        }
        //如果child有构造函数，则调用child的construct
        if (Child.prototype.hasOwnProperty("__construct")) {
            Child.prototype.__construct.apply(this, arguments);
        }
    };
    Parent = Parent || Object;
    //创建一个空函数
    F = function () {
    };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.uber = Parent.prototype;
    Child.prototype.constructor = Child;
    //拷贝method
    for (i in props) {
        if (props.hasOwnProperty(i)) {
            Child.prototype[i] = props[i];
        }
    }
    return Child;
};

var Man = klass(null, {
    __construct: function (what) {
        console.log("Man's constructor");
        this.name = what;
    },
    getName: function () {
        return this.name;
    }
});

var first = new Man('Adam'); // logs "Man's constructor"
console.log(first.getName()); // "Adam"

var SuperMan = klass(Man, {
    __construct: function (what,age) {
        console.log("SuperMan's constructor");
        this.age = age;
    },
    getName: function () {
        var name = SuperMan.uber.getName.call(this);
        return "I am " + name;
    },
    getAge:function(){
        return this.age;
    }
});

var clark = new SuperMan('Clark Kent',12);
console.log(clark.getName()); // "I am Clark Kent"
console.log(clark.getAge())  // 12
console.log(clark instanceof Man); // true
console.log(clark instanceof SuperMan); // true
