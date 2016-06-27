var demo = (function () {
    var fileInput = document.getElementById('upload'),
        beforeImg = document.getElementById('before'),
        afterImg = document.getElementById('after'),
        downloadLink = document.getElementById('download');
    
    fileInput.addEventListener('change', function () {
        var file = fileInput.files[0];
        
        if (file instanceof File && /\.(jpe?g|png|gif)$/i.test(file.name)) {
            var reader = new FileReader(),
                canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');
            
            reader.addEventListener('load', function () {
                var dataURL = this.result,
                
                    width,
                    height,
                    
                    pixelator;
                
                beforeImg.src = dataURL;
                
                width = beforeImg.width;
                height = beforeImg.height;
                
                canvas.width = width;
                canvas.height = height;
                
                ctx.drawImage(beforeImg, 0, 0, width, height);
                
                pixelator = new Pixelator(ctx.getImageData(0, 0, width, height));
                
                afterImg.src = pixelator.pixelate(2, 2).toDataURL();
            });
            
            reader.readAsDataURL(file);
        }
    });
    
    return {}; // Nothing to export so far.
})();
