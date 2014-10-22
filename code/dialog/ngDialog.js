/**
 * Created by Administrator on 2014/10/22.
 */
angular.module("ngDialog",[]).factory("createDialog", ["$document","$compile", "$rootScope", "$controller", "$timeout",function($document,$compile, $rootScope, $controller, $timeout){
   var defaults = {
       id: null,
       template: null,
       templateUrl: null,
       title: "dialog",
       success: {label:"ok", fn:null},
       cancel: {label:"cancel", fn: null},
       controller:null,
       backdrop:true,
       backdropClass: "modal-backdrop",
       backdropCancel: true,
       footerTemplate: null,
       modalClass: "modal",
       css: {
           top: '100px',
           left: '30%',
           margin: '0 auto'
       }
   }
   var body = $document.find("body");
   return function Dialog(options){
       options = angular.extend({}, defaults, options);
       var key, idAttr = options.id ? ' id="' + options.id + '" ' : '';
       var defaultFooter =  '<button class="btn" ng-click="$modalCancel()">{{$modalCancelLabel}}</button>' +
           '<button class="btn btn-primary" ng-click="$modalSuccess()">{{$modalSuccessLabel}}</button>';
       //dialog 的footer
       var footerTemplate = '<div class="modal-footer">' +
           (options.footerTemplate || defaultFooter) +
           '</div>';
       //dialog 的body
       var modalBody = (function(){
           if(options.template){
               return '<div class="modal-body">' + options.template + '</div>';

           } else {
               // Template url
               return '<div class="modal-body" ng-include="\'' + options.templateUrl + '\'"></div>'
           }
       })();
       var modalEl = angular.element(
               '<div class="' + options.modalClass + ' fade"' + idAttr + ' style="display: block;">' +
               '  <div class="modal-dialog">' +
               '    <div class="modal-content">' +
               '      <div class="modal-header">' +
               '        <button type="button" class="close" ng-click="$modalCancel()">&times;</button>' +
               '        <h2>{{$title}}</h2>' +
               '      </div>' +
               modalBody +
               footerTemplate +
               '    </div>' +
               '  </div>' +
               '</div>');
       //添加样式
       for(key in options.css) {
           modalEl.css(key, options.css[key]);
       }
       var divHTML = "<div ";
       if(options.backdropCancel){
           divHTML+='ng-click="$modalCancel()"';
       }
       divHTML+=">";
       var backdropEl = angular.element(divHTML);
       backdropEl.addClass(options.backdropClass);
       backdropEl.addClass('fade in');

       //绑定 esc 快捷键
       var handleEscPressed = function (event) {
           if (event.keyCode === 27) {
               scope.$modalCancel();
           }
       };

       var closeFn = function () {
           body.unbind('keydown', handleEscPressed);
           modalEl.remove();
           if (options.backdrop) {
               backdropEl.remove();
           }
       };

       body.bind('keydown', handleEscPressed);
       var ctrl, locals,
           scope = options.scope || $rootScope.$new();

       scope.$title = options.title;
       scope.$modalClose = closeFn;
       scope.$modalCancel = function () {
           var callFn = options.cancel.fn || closeFn;
           callFn.call(this);
           scope.$modalClose();
       };
       scope.$modalSuccess = function () {
           var callFn = options.success.fn || closeFn;
           callFn.call(this);
           scope.$modalClose();
       };
       scope.$modalSuccessLabel = options.success.label;
       scope.$modalCancelLabel = options.cancel.label;

       if (options.controller) {
           locals = angular.extend({$scope: scope}, passedInLocals);
           ctrl = $controller(options.controller, locals);
           // Yes, ngControllerController is not a typo
           modalEl.contents().data('$ngControllerController', ctrl);
       }

       $compile(modalEl)(scope);
       $compile(backdropEl)(scope);
       body.append(modalEl);
       if (options.backdrop) body.append(backdropEl);

       $timeout(function () {
           modalEl.addClass('in');
       }, 200);
   }
}])
