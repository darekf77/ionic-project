angular.module('starter')

.directive 'galleryList', ($timeout) ->
    templateUrl:'app/shared/list/list.html'
    restrict:'E'
    scope:
        ngModel:"="
        eventHandler:"="
        totalItems:"="
    link: ($scope,elem,attr,model) ->
        elemenstOnPage = 10
        $scope.currentPage = 1        
        defaultMaxSize  = 3
        $scope.maxSize = defaultMaxSize
        
        bottomIndex = 0
        topIndex = bottomIndex + elemenstOnPage
        
        fitDataAfterFiltering = (arrFiltr)=>
            filtrArrDiff = elemenstOnPage - arrFiltr.length
            console.log 'filtrArrDiff',filtrArrDiff            
            counter = 0
            angular.forEach allFiles, (v,k) =>
                # if bottom > 0 then debugger
                condition = v not in arrFiltr and 
                filtrArrDiff > 0 and 
                ++counter > bottomIndex and
                v.type is $scope.filter.item.type                
                # debugger
                # if condition then debugger
                # if v.id is 1 and bottom > 0 then debugger
                if condition then do () =>
                    arrFiltr.push v                    
                    --filtrArrDiff
            if filtrArrDiff > 0 and topIndex < allFiles.length then downloadMoreData()
        
        $scope.filter = 
            startIndex:0
            item:
                type:2
                typeItems: '2'
                thread: 0
                sizeChanged: (filteredArray) => 
                    fitDataAfterFiltering(filteredArray)
                    
        console.info $scope.filter
        
        $scope.files = [];
        allFiles = []
        
        $scope.setPage = (pageNo) ->
            console.info pageNo
            $scope.currentPage = pageNo;
        
        prepareArray = (destArray) =>
            counter = 0
            angular.forEach allFiles, (v,k) =>
                if counter >= bottomIndex and counter  < topIndex
                    destArray.push v 
                ++counter
        
        downloadMoreData = () =>
            promise = $scope.eventHandler.getMoreData()
            promise.then () =>
                console.info 'New json is ok'
            ,() =>
                console.info 'New json is bad'
                prepareArray($scope.files)
        
        prepareDispalyFiles = () =>
            $scope.files.length = 0;            
            bottomIndex = $scope.filter.startIndex
            counter = 0
            startAfterFiltering = 0
            if $scope.filter.item.type isnt 2 and $scope.currentPage > 1 then do () =>
                angular.forEach allFiles, (v,k) =>
                    if counter is ($scope.currentPage-1)*elemenstOnPage then return 
                    if v.type is $scope.filter.item.type then ++counter
                    ++startAfterFiltering
                bottomIndex =startAfterFiltering                
            topIndex = bottomIndex + elemenstOnPage
            
            tmp = []
            prepareArray(tmp)            
            if $scope.filter.item.type isnt 2 and 
                $scope.currentPage > 1 and 
                tmp.length < elemenstOnPage then do () =>
                    console.log "tmp.length ",tmp.length    
                    # debugger 
                    fitDataAfterFiltering(tmp)            
                    console.log "ALE PIZDA",tmp                      
                    $timeout( ()=>            
                        console.log "ALE PIZDA",tmp            
                        $scope.files = tmp
                    ,0)
                        
                    # petla i zwiększać/ szukać
            else do ()=>
                if topIndex >= allFiles.length
                    downloadMoreData()
                    return            
                prepareArray($scope.files)
            
        
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
            $scope.filter.item.type = parseInt($scope.filter.item.typeItems)
            if $scope.filter.item.type is 2 then $scope.maxSize = defaultMaxSize
            else $scope.maxSize = 0
            console.log $scope.filter.item.type