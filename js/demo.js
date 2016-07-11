var demo = (function() {
    var fileInput = document.getElementById('upload'),
        selectAll = document.getElementById('select-all'),
        selectPortion = document.getElementById('select-portion'),
        widthInput = document.getElementById('section-width'),
        heightInput = document.getElementById('section-height'),
        pixelateBtn = document.getElementById('pixelate-btn'),
        
        outputContainer = document.getElementById('output-container'),
            beforeImg = document.getElementById('before'),
            afterImg = document.getElementById('after'),
            downloadLink = document.getElementById('download'),
        
        errorContainer = document.getElementById('error-container'),
        
        pixelations = [];
    
    pixelateBtn.addEventListener('click', function () {
        var file = fileInput.files[0];
        
        hide(errorContainer);
        
        if (file instanceof File && /\.(jpe?g|png|gif)$/i.test(file.name)) {
            var reader = new FileReader(),
                canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');
            
            reader.addEventListener('load', function () {
                var dataURL = this.result,
                    afterImgDataURL,
                
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
                
                afterImgDataURL = pixelator.pixelate((widthInput.value | 0) || 10, (heightInput.value | 0) || 10).canvas.toDataURL('image/png', 1);
                afterImg.src = afterImgDataURL;
                
                downloadLink.href = afterImgDataURL;
                downloadLink.download = '(pixelated) ' + file.name;
                
                show(outputContainer);
                
                pixelations.push(new Pixelation(pixelator, dataURL, afterImgDataURL));
            });
            
            reader.readAsDataURL(file);
        } else {
            error('As of now, this tool only supports jpg, jpeg, png, and gif files.');
        }
    });
    
    selectAll.addEventListener('change', function() {
        if (selectAll.checked) {
            hide(selectPortion, clearSelection);
        } else {
            show(selectPortion, clearSelection);
        }
    });
    
    function error(msg) {
        show(errorContainer);
        hide(outputContainer);
        
        errorContainer.innerHTML = msg;
    }
    
    function show() {
        var i = arguments.length;
        
        while (i--) {
            arguments[i].style.display = 'inherit';
        }
    }
    
    function hide() {
        var i = arguments.length;
        
        while (i--) {
            arguments[i].style.display = 'none';
        }
    }
    
    function Pixelation(pixelator, beforeURL, afterURL) {
        this.pixelator = pixelator;
        this.beforeURL = beforeURL;
        this.afterURL = afterURL;
        this.id = Pixelation.getId();
    }
    
    Pixelation.getId = (function() {
        var id = 0;
        
        return function() {
            return id++;
        }
    })();
    
    return {
        error: error,
        show: show,
        hide: hide,
        
        fileInput: fileInput,
        selectAll: selectAll,
        selectPortion: selectPortion,
        widthInput: widthInput,
        heightInput: heightInput,
        
        beforeImage: beforeImg,
        afterImage: afterImg,
        downloadLink: downloadLink,
        
        pixelations: pixelations
    }; // For debug purposes.
})();
