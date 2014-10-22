/**
 * Created by Administrator on 2014/10/22.
 */
var app = angular.module('FundooModalApp', ['ngDialog'])
    .controller('MainCtrl', ['$scope', 'createDialog', function($scope, createDialogService) {
        $scope.launchSimpleModal = function() {
            createDialogService({
                id: 'simpleDialog',
                title: 'A Simple Modal Dialog',
                backdrop: true,
                templateUrl:"simpleModal.html" ,
                success: {label: 'ok', fn: function() {console.log('Simple modal closed');}}
            });
        };

    }]);
