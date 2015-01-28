function Slide(options){
    this.$el = $("#"+ options.id);
    this.$items = $(".item", this.$el);
    this.len = this.$items.length;
    this.width = options.width || 800;
    this.height = options.height || 400;
    this.center = Math.ceil(this.len / 2) -1;
    this.init();
}
_Slide = Slide.prototype;

_Slide.init = function(){
    var len = this.len;
    var $item =  this.$items;
    for(var i = 0; i < len; ++i) {
        $($item[i]).css(this.getCssText(i)).attr("data-index", i + 1);
    }
    var _this = this;
    setInterval(function(){_this.next()},6000);
}
_Slide.getCssText = function(i){
    var len = this.len;
    var cssText;
    var center = Math.ceil(len / 2) -1;
        if(i < center){
            cssText = {
                "width": this.width -(center-i)* 133 + "px",
                "height": this.height -(center - i) * 67 + "px",
                "top": (center - i) * 33 + "px",
                "left":(i) * 25 + "px",
                "z-index": i + 1
            }
        }else if( i >= center) {
            var width = this.width - (i - center) * 133;
            cssText = {
                "width": width + "px",
                "height": this.height - (i - center) * 67 + "px",
                "top": (i - center) * 33 + "px",
                "left": this.width - width + i * 25 + "px",
                "z-index": (len - i)
            }
        }
        return cssText;

}
_Slide.refresh = function(){
    var $item = this.$items;
    var p1 = $(".item[data-index=1]");
    var p2 = $(".item[data-index=2]");
    var p3 = $(".item[data-index=3]");
    var p4 = $(".item[data-index=4]");
    var p5 = $(".item[data-index=5]");
    $item.removeClass("current");
    $(".item[data-index='2']").addClass("current");
    $(".item[data-index=0]").animate(this.getCssText(2), 150);
    p1.animate(this.getCssText(1),150);
    p3.animate(this.getCssText(3),150);
    p4.animate(this.getCssText(4),150);
    p5.animate(this.getCssText(0), 150);
    $(".current").animate(this.getCssText(this.center), 50);
}
_Slide.next = function(){
    var $item = this.$items;
    for(var i = 0; i < this.len; ++i) {
        var index = $($item[i]).attr("data-index");
        index = parseInt(index) + 1;
        if(index > this.len){
            index = Math.abs(this.len - index);
        }
        $($item[i]).attr("data-index", index);
    }
    this.refresh();
}
_Slide.prev = function(){
    var $item = this.$items;
    for(var i = 0; i < this.len; ++i) {
        var index = $($item[i]).attr("data-index");
        index = parseInt(index) - 1;
        if(index <= 0){
            index = 5;
        }
        $($item[i]).attr("data-index", index);
    }
    this.refresh();
    }
