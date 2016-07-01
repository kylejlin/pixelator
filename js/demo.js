var demo = (function () {
    var fileInput = document.getElementById('upload'),
        widthInput = document.getElementById('section-width'),
        heightInput = document.getElementById('section-height'),
        pixelateBtn = document.getElementById('pixelate-btn'),
        
        outputContainer = document.getElementById('output-container'),
            beforeImg = document.getElementById('before'),
            afterImg = document.getElementById('after'),
            downloadLink = document.getElementById('download'),
        
        errorContainer = document.getElementById('error-container');
    
    pixelateBtn.addEventListener('click', function () {
        var file = fileInput.files[0];
        
        hide(errorContainer);
        
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
                
                afterImg.src = pixelator.pixelate((widthInput.value | 0) || 10, (heightInput.value | 0) || 10).canvas.toDataURL();
                
                show(outputContainer);
            });
            
            reader.readAsDataURL(file);
        } else {
            error('As of now, this tool only supports jpg, jpeg, png, and gif files.');
        }
    });
    
    function error(msg) {
        show(errorContainer);
        hide(outputContainer);
        
        errorContainer.innerHTML = msg;
    }
    
    function show(elem) {
        elem.style.display = 'inherit';
    }
    
    function hide(elem) {
        elem.style.display = 'none';
    }
    
    return {
        error: error
    }; // Nothing to export so far.
})();
