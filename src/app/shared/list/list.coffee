angular.module('starter')

.directive 'galleryList', ($timeout,$filter) ->
    templateUrl:'app/shared/list/list.html'
    restrict:'E'
    scope:
        ngModel:"="
        eventHandler:"="
        totalItems:"="
    link: ($scope,elem,attr,model) ->
        $scope.files = [];
        allFiles = []
    
        tmpTotalItems = 0
        elemenstOnPage = 10
        $scope.currentPage = 1        
        defaultMaxSize  = 3
        $scope.maxSize = defaultMaxSize
        
        bottomIndex = 0
        topIndex = bottomIndex + elemenstOnPage
        
        $scope.filter = 
            startIndex:0
            item:
                type:2
                typeItems: '2'
                thread: 0
        
        isFilteringMode = ()=> $scope.filter.item.type isnt 2
        
        contains = (obj,destArray) =>
            tmp = false
            angular.forEach destArray, (v,k) =>
                if v.id is obj.id then tmp = true
            return tmp
        
        fitExistingData = (arrFiltr)=>
            filtrArrDiff = elemenstOnPage - arrFiltr.length 
            counter = 0
            angular.forEach allFiles, (v,k) =>
                condition =  !contains(v,arrFiltr) and
                filtrArrDiff > 0 and 
                ++counter > topIndex and
                v.type is $scope.filter.item.type
                if condition then do () =>
                    arrFiltr.push v                    
                    --filtrArrDiff
                
        $scope.setPage = (pageNo) ->
            $scope.currentPage = pageNo;
            
        countFilesWithType = (type) =>
            counter = 0
            angular.forEach allFiles, (v,k) ->
                if v.type == type then ++counter
            counter
        
        tmpTotalFiltering = false
        prepareArray = (destArray) =>
            beforeArr = angular.copy destArray
            destArray.length = 0
            t = allFiles
            if isFilteringMode() then t =  
                $filter('galleryFilter')(allFiles,$scope.filter.item)
            counter = 0
            angular.forEach t, (v,k) =>
                if counter >= bottomIndex and counter  < topIndex and !contains(v,destArray)
                    destArray.push v 
                ++counter
            if isFilteringMode() and destArray.length is 0 then do ()=>
                angular.forEach beforeArr, (v,k)=>
                    destArray.push v
                newTotalItems = countFilesWithType($scope.filter.item.type)
                $timeout(-> 
                    tmpTotalFiltering = true
                    $scope.totalItems = newTotalItems
                ,0)
            else if destArray.length isnt 0
                $timeout(->          
                    if tmpTotalFiltering then tmpTotalFiltering = false          
                    else $scope.totalItems = tmpTotalItems
                ,0)
                
        
        emptyFn = =>
        downloadMoreData = () =>
            promise = $scope.eventHandler.getMoreData()
            promise.then emptyFn,() =>
                prepareArray($scope.files)
        
        prepareDispalyFiles = () =>   
            bottomIndex = $scope.filter.startIndex
            topIndex = bottomIndex + elemenstOnPage
            prepareArray($scope.files)
            if $scope.files isnt elemenstOnPage and 
                isFilteringMode() and
                allFiles.length < $scope.totalItems then fitExistingData($scope.files)
            if ($scope.files isnt elemenstOnPage and 
                isFilteringMode() and
                allFiles.length < $scope.totalItems) or 
            (!isFilteringMode() and topIndex >= allFiles.length) then downloadMoreData()
        
        $scope.pageChanged = ()  ->
            $scope.filter.startIndex = ($scope.currentPage-1)*elemenstOnPage
            prepareDispalyFiles()               
       
        $scope.$watchCollection 'ngModel.data', (newValue,oldValue) ->
            if !newValue 
                return
            angular.forEach newValue, (v,k)  ->  
                allFiles.push v
            tmpTotalItems = $scope.totalItems
            prepareDispalyFiles()
                  
        
        $scope.filterChanged = () ->
            $scope.filter.item.type = parseInt($scope.filter.item.typeItems)
            if !isFilteringMode() then $scope.maxSize = defaultMaxSize
            else $scope.maxSize = 0 
            prepareDispalyFiles()
            
            