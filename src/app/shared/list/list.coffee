angular.module('starter')

.directive 'galleryList',  ->
    templateUrl:'app/shared/list/list.html'
    restrict:'E'
    scope:
        ngModel:"="
        eventHandler:"="
        totalItems:"="
    link: ($scope,elem,attr,model) ->
        elemenstOnPage = 10
        $scope.currentPage = 1        
        $scope.maxSize = 2
        $scope.filter = 
            startIndex:0
            item:
                type:2
                thread: 0
        
        $scope.files = [];
        allFiles = []
        
        $scope.setPage = (pageNo) ->
            console.info pageNo
            $scope.currentPage = pageNo;
        
        prepareArray = () =>
            angular.forEach allFiles, (v,k) =>
                if @counter >= @bottomIndex and @counter  < @topIndex
                    $scope.files.push v 
                ++counter
        
        prepareDispalyFiles = () =>
            $scope.files.length = 0;
            @counter = 0
            @bottomIndex = $scope.filter.startIndex
            @topIndex = $scope.filter.startIndex + elemenstOnPage
            if topIndex >= allFiles.length
                promise = $scope.eventHandler.getMoreData()
                promise.then () =>
                    console.info 'New json is ok'
                ,() =>
                    console.info 'New json is bad'
                    prepareArray()
                return            
            prepareArray()
            
        
        $scope.pageChanged = ()  ->
            $scope.eventHandler.pageChanged
                pageNum : $scope.currentPage
                totalItems : $scope.totalItems
            $scope.filter.startIndex = ($scope.currentPage-1)*elemenstOnPage
            prepareDispalyFiles()
               
       
        $scope.$watchCollection 'ngModel.data', (newValue,oldValue) ->
            if !newValue 
                return
            angular.forEach newValue, (v,k)  ->  
                allFiles.push v
            prepareDispalyFiles()
                  
        
        $scope.filterChanged = () ->
            console.info $scope.filter