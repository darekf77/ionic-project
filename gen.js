var arr = []
for (var index = 0; index < 61; index++) {
    var r = Math.floor(Math.random() * 10) + 1
    
    var item = {
        id: index,
        thread: r,
        type: index % 3 == 0?1:0 ,
        url: "http://placekitten.com/200/300?number="+r
    }
    arr.push(JSON.stringify(item));        
}

console.log(arr)