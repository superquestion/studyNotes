var inherit = (function(){
    var f = function(){};
    return function(p, c){
        f.prototype = p.prototype;
        c.prototype = new f();
        c.uber = p.prototype;
        c.prototype.constructor = c;
    }
}())

 function person(name){
     this.name = name;
 }
person.prototype.getName = function(){
    return this.name;
}

function child(name){
    person.call(this, name);
}
inherit(person, child);
//var c = new child();
var c = new child('c');
//c.name = 'c';
console.log(c.getName()); //c
console.log(c.constructor.name) //child
