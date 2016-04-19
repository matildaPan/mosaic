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
    var canvas = document.getElementById("imageTiles");
    var ctx = canvas.getContext("2d");
    
    var uploaded_image = document.getElementById("myImage");
    var image_width = uploaded_image.width;
    var image_height = uploaded_image.height;
    canvas.width = image_width;
    canvas.height = image_height;
    
    var num = 2;
    var tile_width = image_width/num;
    var tile_height = image_height/num;
    
    //var image_src = uploaded_image.src;

    var pieces = [];
    
    for(var i = 0; i <num; i++){
        for(var j = 0; j <num; j++){
            var p = {row: i, col: j};
            pieces.push(p);
        }
    }
    

    
    for(var index=0; index<pieces.length; index++){
        var p = pieces[index];
        var row = p.row;
        var col = p.col;
        
        var sx = row*tile_width;
        var sy = col*tile_height;
        
        ctx.drawImage(uploaded_image, sx, sy, tile_width, tile_height, sx, sy, tile_width, tile_height);

        

    }
    //  ctx.drawImage(uploaded_image, 0, 0, 150, 150, 20, 20, 0, 0);
    
    
    
    
}