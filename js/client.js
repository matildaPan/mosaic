// Edit me.
window.onload = function () {
    //init();
    
    var input_field = document.querySelector("input[type='file']");
    input_field.addEventListener("change", function () {
        console.log("changed");
        var reader = new FileReader();
        reader.onload = showUploadedImage;
        reader.readAsDataURL(this.files[0]);
    });
    

};

function showUploadedImage(e) {
    document.getElementById("myImage").setAttribute('src', e.target.result);
}

function cutImageIntoTiles() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    
    
    
    var uploaded_image = document.getElementById("myImage");
    var image_width = uploaded_image.width;
    var image_height = uploaded_image.height;
    canvas.width = image_width;
    canvas.height = image_height;
    
    ctx.drawImage(uploaded_image, 0, 0, image_width, image_height);


    var num = 100;
    var tile_width = image_width/num;
    var tile_height = image_height/num;
    
    //var image_src = uploaded_image.src;

    var pieces = [];
    
    for(var i = 0; i <num; i++){
        for(var j = 0; j <num; j++){
            var p = {col: i, row: j};
            pieces.push(p);
        }
    }
    
    var tileData = [];
    

    
    for(var index=0; index<pieces.length; index++){
        
        var p = pieces[index];
        var row = p.row;
        var col = p.col;
        
        let colorSum = { r:0, g:0, b:0 }
        var count = tile_width * tile_height;
        for (var i = row*tile_width; i < (row+1)*tile_width; i++){
            for(var j=col*tile_height; j < (col+1)*tile_height; j++) {
                let pixelData = canvas.getContext('2d').getImageData(i, j, 1, 1).data;
                colorSum.r += pixelData[0];
                colorSum.g += pixelData[1];
                colorSum.b += pixelData[2];
                //colorSum.a += pixelData[3];
            } 
        }
        
        let averageColor = {};
        averageColor.r = Math.round(colorSum.r/count);
        averageColor.g = Math.round(colorSum.g/count);
        averageColor.b = Math.round(colorSum.b/count);
        //averageColor.a = colorSum.a/count;
        
        var averageColorHex = rgbToHex(averageColor.r, averageColor.g, averageColor.b);
        
        p.averageColorHex = averageColorHex;
        
        
    }
    //  ctx.drawImage(uploaded_image, 0, 0, 150, 150, 20, 20, 0, 0);
    
    
    
    
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}