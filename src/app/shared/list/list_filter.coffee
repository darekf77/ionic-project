angular.module('starter')

.filter 'galleryFilter', () =>    
    (input,filter) =>
        output = []
        angular.forEach input, (v,k) =>
            typeState = true
            if filter.type isnt 2 and filter.type isnt v.type then typeState = false
            if typeState then output.push v
        return output