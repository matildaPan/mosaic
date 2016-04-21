// Edit me.
window.onload = function () {
    
    let input_field = document.querySelector("input[type='file']");
    input_field.addEventListener("change", function () {
        
        // Remove previous image 
        if(document.getElementById("uploadedImage")){
            document.getElementById("uploadedImage").remove();            
        }
        
        //Remove previous tiles
        let tiles = document.getElementsByClassName("tiles");    

        while (tiles[0]) {
            tiles[0].parentNode.removeChild(tiles[0]);
        }
        
        //Read the image from input and draw it to canvas   
        var reader = new FileReader();
        reader.onload = function () {
            var img = new Image();
            var canvas = document.createElement('canvas');
            canvas.setAttribute("id", "uploadedImage");
            var ctx = canvas.getContext("2d");
            //document.getElementsByTagName("body")[0].appendChild(canvas);
            document.getElementsByTagName("body")[0].insertBefore(canvas, document.getElementById("generateButton"));
            
            // when image is loaded
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

var w;

function StartGeneration() {
    if (typeof (Worker) !== "undefined") {
        var inputNum = parseInt(document.getElementById("rowColNumber").value);
        
        //Create a web worker object
        w = new Worker("js/myWorker.js");
        let uploaded_image = document.getElementById("uploadedImage");
        let ctx = uploaded_image.getContext('2d');
        //Get image data
        var data = ctx.getImageData(0, 0, uploaded_image.width, uploaded_image.height).data;
        
        //Post message to worker.
        w.postMessage({totalPixelData:data, width:uploaded_image.width, height:uploaded_image.height, num:inputNum});
        
        //Listener receives response from worker
        w.onmessage = function (event) {
            let tiles_div = document.createElement("div");
            tiles_div.className = "tiles";
            document.getElementsByTagName("body")[0].appendChild(tiles_div);
            tiles_div.innerHTML = event.data;
        };
    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Workers...";
    }
}


