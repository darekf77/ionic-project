angular.module('starter')

.directive 'galleryListItem', ($timeout) ->
    templateUrl:'app/shared/list/item/list_item.html'
    restrict:'E'
    scope: {
        url: '@itemUrl'
        id:'@itemId'
        type: '=itemType'
        thread: '=itemThread'
        filter: "="
    }
    replace: true
    link: ($scope,elem) ->  
        $scope.hover = () =>
            angular.element(elem).parent().find('.'+$scope.thread).addClass('shine');
            return
            
        $scope.leave = () =>
            angular.element(elem).parent().find('.'+$scope.thread).removeClass('shine');
            return
        