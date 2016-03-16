angular.module('starter')

.config ($stateProvider,$urlRouterProvider) ->
   $stateProvider.state 'gallery',
        url: '/gallery'
        templateUrl: 'app/components/gallery/gallery.html'
        controller: 'GalleryController'
    $urlRouterProvider.otherwise '/gallery'
        
.controller 'GalleryController', 
    ($scope,$q,galleryFactory) ->
        prepareElement = (item) ->
            angular.forEach item.data, (v,k)->
                randomKittyId = Math.floor(Math.random() * 10) + 1  
                v.url = "#{v.url}?image=#{randomKittyId}" 
        
        $scope.totalItems = 0
        
        counterJSONid =1         
        getElements = (counter) =>
            defer = $q.defer();
            galleryFactory.get id:counter , (item) =>            
                item.$promise.then (data) =>
                    # if angular.isDefined $scope.model and
                    # angular.isDefined $scope.model.data and
                    # $scope.model.data.length + data.data.length > data._meta.all then do ()=>
                    #     defer.reject()
                    # else do () =>
                    $scope.totalItems = data._meta.all
                    $scope.model = data
                    defer.resolve();
                , () =>
                    defer.reject()
            , () =>
                defer.reject()
            defer.promise
            
        getElements(counterJSONid++)
    
        $scope.eventHandler = 
            getMoreData: () =>
                getElements(counterJSONid++)
                
                