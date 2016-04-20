// Edit me.
window.onload = function () {
    
    var input_field = document.querySelector("input[type='file']");
    input_field.addEventListener("change", function () {
        console.log("changed");
        var reader = new FileReader();
        reader.onload = function () {
            var img = new Image();
            var canvas = document.createElement('canvas');
            canvas.setAttribute("id", "uploadedImage");
            var ctx = canvas.getContext("2d");
            document.getElementsByTagName("body")[0].appendChild(canvas);
            
            img.onload = function(){
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img,0,0);
            }
            
            img.src = event.target.result;
        }
        reader.readAsDataURL(this.files[0]);
    });
    

};

// function showUploadedImage(e) {
//     document.getElementById("myImage").setAttribute('src', e.target.result);
// }

function MosaicGenerator() {
 
    var uploaded_image = document.getElementById("uploadedImage");
    var image_width = uploaded_image.width;
    var image_height = uploaded_image.height;


    var num = 10;
    var tile_width = image_width/num;
    var tile_height = image_height/num;
    

    pieces = [];
    for(var i = 0; i <num; i++){
        for(var j = 0; j <num; j++){
            var p = {col: i, row: j};
            pieces.push(p);
        }
    }
  
        
    for(var index=0; index<pieces.length; index++){
        
        var p = pieces[index];
        var row = p.row;
        var col = p.col;
        
        var colorSum = { r:0, g:0, b:0 }
        var count = tile_width * tile_height;
        for (var i = row*tile_width; i < (row+1)*tile_width; i++){
            for(var j=col*tile_height; j < (col+1)*tile_height; j++) {
                var pixelData = uploaded_image.getContext('2d').getImageData(i, j, 1, 1).data;
                colorSum.r += pixelData[0];
                colorSum.g += pixelData[1];
                colorSum.b += pixelData[2];
                //colorSum.a += pixelData[3];
            } 
        }
        
        var averageColor = {};
        averageColor.r = Math.round(getAverageColor(colorSum.r, count));
        averageColor.g = Math.round(getAverageColor(colorSum.g, count));
        averageColor.b = Math.round(getAverageColor(colorSum.b, count));
        //averageColor.a = colorSum.a/count;
        
        var averageColorHex = rgbToHex(averageColor.r, averageColor.g, averageColor.b);
        
        p.averageColorHex = averageColorHex;
        
        //var svg = sendHexColor(averageColorHex);
        
        p.xhttp = new XMLHttpRequest();
        p.xhttp.open("GET", "/color/" + averageColorHex, true);
        p.xhttp.send();
        
        p.xhttp.addEventListener("readystatechange", processRequest, false);
        p.processed = false;
     
    }
      
}


function processRequest(e) {
    
    for(var i=0; i<pieces.length; i++){
        var p = pieces[i];
        if (p.xhttp.readyState == 4 && p.xhttp.status == 200 && !p.processed) {

            p.processed = true;
            
            var tiles_div = document.createElement("div");
            document.getElementsByTagName("body")[0].appendChild(tiles_div);
            var svg = p.xhttp.responseText;
            tiles_div.innerHTML = svg;
        }
    }
    
}

function getAverageColor(color_sum, count) {
    return color_sum/count;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}