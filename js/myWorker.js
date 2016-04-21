
var imageLoaded = {};
var loadedRow = [];
var pieces = [];
var num = 0;

onmessage = function(e) {
    console.log('Message received from main script');
     MosaicGenerator(e.data.totalPixelData, e.data.width, e.data.height, e.data.num);
}

function MosaicGenerator(totalPixelData, width, height, inputNum) {
 
    //var uploaded_image = document.getElementById("uploadedImage");
    var image_width = width;
    var image_height = height;


    if(isNaN(inputNum)){
        num = 5;
    }else{
        num = inputNum;        
    }
    
    var tile_width = Math.round(image_width/num);
    var tile_height = Math.round(image_height/num);
    

    for(var i = 0; i <num; i++){
        for(var j = 0; j <num; j++){
            var p = {col: j, row: i};
            pieces.push(p);
        }
    }
  
        
    for(var index=0; index<pieces.length; index++){
        
     
        
        let p = pieces[index];
        
       
        let row = p.row;
        let col = p.col;
        
        let colorSum = { r:0, g:0, b:0 }
        let count = tile_width * tile_height;
        for (let i = row*tile_width; i < (row+1)*tile_width; i++){
            for(let j=col*tile_height; j < (col+1)*tile_height; j++) {
                
                let offset = (i * image_width + j) * 4;
                
                colorSum.r += totalPixelData[offset + 0];
                colorSum.g += totalPixelData[offset + 1];
                colorSum.b += totalPixelData[offset + 2];
                //colorSum.a += pixelData[offset + 3];
            } 
        }
        
        let averageColor = {};
        averageColor.r = Math.round(getAverageColor(colorSum.r, count));
        averageColor.g = Math.round(getAverageColor(colorSum.g, count));
        averageColor.b = Math.round(getAverageColor(colorSum.b, count));
        //averageColor.a = colorSum.a/count;
        
        let averageColorHex = rgbToHex(averageColor.r, averageColor.g, averageColor.b);
        
        p.averageColorHex = averageColorHex;
        
        
        if(!imageLoaded[p.row]){
            imageLoaded[p.row] = {};
            imageLoaded[p.row].Count = 0;
            imageLoaded[p.row].Images = new Array(num);
            imageLoaded[p.row].showed = false;
            for (let k = 0; k < num; k++){
                imageLoaded[p.row].Images[k] = '';
            }        
        }
       // postMessage("Tile "+p.row+","+p.col+" processed.")
        makeRequest("/color/" + averageColorHex).then(function(svg){
            imageLoaded[p.row].Count += 1; 
            imageLoaded[p.row].Images[p.col] = svg; 
            // if (imageLoaded[p.row].Count == num && imageLoaded[p.row].showed == false){
            //     let rowImgaes = imageLoaded[p.row].Images.join('');
            //     postMessage(rowImgaes);
            //     imageLoaded[p.row].showed == true;
            // }

            
        },function(error){
            console.log(error.status + ": "+error.statusText);
        })
     
    }
    
    setTimeout(function() {
        for(let row=0; row < num; row++){
              sendSvgRow(imageLoaded[row]);             
        }
    }, 2000);
      
}


function sendSvgRow(rowImageLoaded) {
    if (rowImageLoaded.Count == num && rowImageLoaded.showed == false){
        let rowImgaes = rowImageLoaded.Images.join('');
        postMessage(rowImgaes);
        rowImageLoaded.showed == true;
    }else{
        setTimeout(sendSvgRow, 1000);
    }
}

function makeRequest(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function () {
            if (this.status == 200) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
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