angular.module('starter')

.directive 'galleryListItem', ->
    templateUrl:'app/shared/list/item/list_item.html'
    restrict:'E'
    scope: {
        url: '@itemUrl'
        filter: "="
    }
    replace: true
    link: ($scope) ->    
        $scope.hover = () ->
            console.log 'hower',$scope.filter
    