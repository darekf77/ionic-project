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
        tmpItem = []
        
        counterJSONid =1         
        getElements = (counter) =>
            defer = $q.defer();
            galleryFactory.get id:counter , (item) =>            
                item.$promise.then (data) =>                                       
                    $scope.totalItems = data._meta.all
                    if tmpItem.length <= $scope.totalItems
                        $scope.model = data
                    defer.resolve();      
            , () =>
                defer.reject()
            defer.promise
            
        getElements(counterJSONid++)
    
        $scope.eventHandler = 
            pageChanged: (data) ->
                # console.log 'eventHandler',data 
            getMoreData: () =>
                getElements(counterJSONid++)
                
                