var demo = (function() {
    var fileInput = document.getElementById('upload'),
        
        selectAll = document.getElementById('select-all'),
        selectPortionContainer = document.getElementById('select-portion'),
            selectPortion = document.getElementById('select-portion'),
            clearSelection = document.getElementById('clear-selection'),
            
        widthInput = document.getElementById('section-width'),
        heightInput = document.getElementById('section-height'),
        pixelateBtn = document.getElementById('pixelate-btn'),
        
        outputContainer = document.getElementById('output-container'),
            beforeImg = document.getElementById('before'),
            afterImg = document.getElementById('after'),
            downloadLink = document.getElementById('download'),
        
        errorContainer = document.getElementById('error-container'),
        
        selectedPortion = {x: 0, y: 0, width: 0, height: 0, status: 0},
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
                    pixelatedPortionURL,
                    pixelatedPortionImage = document.createElement('img'),
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
                
                if (selectAll.checked || selectedPortion.width <= 0 || selectedPortion.height <= 0) {
                    pixelator = new Pixelator(ctx.getImageData(0, 0, width, height));
                } else {
                    pixelator = new Pixelator(ctx.getImageData(selectedPortion.x, selectedPortion.y, selectedPortion.width, selectedPortion.height));
                }
                
                // TODO: Fix file type and put pixelated portion on original image.
                pixelatedPortionURL = pixelator.pixelate((widthInput.value | 0) || 10, (heightInput.value | 0) || 10).canvas.toDataURL('image/png', 1);
                pixelatedPortionImage.src = pixelatedPortionURL;
                
                ctx.drawImage(pixelatedPortionImage, 0, 0, pixelatedPortionImage.width, pixelatedPortionImage.height);
                afterImgDataURL = canvas.toDataURL('image/png', 1.0);
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
    
    selectPortion.addEventListener('click', function(e) {
        var status = selectedPortion.status,
            coords = getClickCoords(selectPortion, e),
            x = coords.x,
            y = coords.y;
        
        switch (status) {
            case 0:
                selectedPortion.x = x;
                selectedPortion.y = y;
                selectedPortion.status = 1;
                break;
            
            case 1:
                if (x <= selectedPortion.x || y <= selectedPortion.y) {
                    error('The second point must be lower and to the right of the first point.');
                    break;
                }
                
                selectedPortion.width = x - selectedPortion.x;
                selectedPortion.height = y - selectedPortion.y;
                selectedPortion.status = 2;
                break;
            
            case 2:
            default:
                break;
        }
    });
    
    clearSelection.addEventListener('click', function() {
        selectedPortion = {x: 0, y: 0, width: 0, height: 0, status: 0};
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
    
    function getClickCoords(elem, event) {
        var rect = elem.getBoundingClientRect();
        
        return {
            x: event.x - rect.left,
            y: event.y - rect.top
        };
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
