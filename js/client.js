// Edit me.
window.onload = function () {
    
    var input_field = document.querySelector("input[type='file']");
    input_field.addEventListener("change", function () {
        if(document.getElementById("uploadedImage")){
            document.getElementById("uploadedImage").remove();
            
        }
        
        var tiles_length = document.getElementsByClassName("tiles");
        
        if(tiles_length){
            for(var i=0; i<tiles_length; i++){
                document.getElementsByClassName("tiles")[i].remove();
            }
        }
        
              
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

var w;

function StartGeneration() {
    if (typeof (Worker) !== "undefined") {
        w = new Worker("js/myWorker.js");
        let uploaded_image = document.getElementById("uploadedImage")
        let ctx = uploaded_image.getContext('2d');
        var data = ctx.getImageData(0, 0, uploaded_image.width, uploaded_image.height).data;
        w.postMessage({totalPixelData:data, width:uploaded_image.width, height:uploaded_image.height});
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

// function showUploadedImage(e) {
//     document.getElementById("myImage").setAttribute('src', e.target.result);
// }
