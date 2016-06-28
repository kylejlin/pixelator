(function () {
    function Pixelator(imageData) {
        if (!validateProps(imageData, Object, 'width', 'number', 'height', 'number', 'data', Uint8ClampedArray)) {
            throw new TypeError('The first argument passed into the Pixelator constructor was not a valid ImageData object.');
        }
        
        this.width = imageData.width;
        this.height = imageData.height;
        this.pixelCollection = new RGBAPixelCollection(imageData);
        this.rawImageData = imageData;
    }
    
    Pixelator.prototype.pixelate = function (sectionWidth, sectionHeight) {
        var sections = this.getAllSections(sectionWidth, sectionHeight),
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            i = sections.length;
        
        while (i--) {
            var section = sections[i],
                average = Pixelator.getAverageColor(section);
            
            ctx.fillStyle = 'rgba(' + average.r + ',' + average.g + ',' + average.b + ',' average.a + ')';
            ctx.fillRect(section.x, section.y, section.width, section.height);
        }
    };
    
    Pixelator.prototype.getAllSections = function (sectionWidth, sectionHeight) {
        
    };
    
    Pixelator.prototype.filters_ = [];
    
    function RGBAPixelCollection (imageData) {
        if (!validateProps(imageData, Object, 'width', 'number', 'height', 'number')) {
            throw new TypeError('The first argument passed into the RGBAPixelCollection constructor was not a valid ImageData object.');
        }
        
        this.width = imageData.width;
        this.height = imageData.height;
        this.pixels = [];
        
        var data = imageData.data;
        
        if (data instanceof Uint8ClampedArray) {
            this.raw = imageData;
            
            for (var i = 0; i < data.length; i+= 4) {
                this.pixels.push(new RGBAColor(data[i], data[i + 1], data[i + 2], data[i + 3]));
            }
        } else {
            var size = this.width * this.height;
            
            for (var i = 0; i < size; i++) {
                this.pixels.push(new RGBAColor(0, 0, 0, 255));
            }
            
            this.raw = this.toSimpleImageData();
        }
    }
    
    RGBAPixelCollection.prototype.getIndicesInRect = function (startX, startY, rectWidth, rectHeight) {
        var indices = [],
            endX = startX + rectWidth - 1,
            endY = startY + rectHeight - 1,
            collectionWidth = this.width;
        
        for (var row = startY; row <= endY; row++) {
            for (var rowCell = startX; rowCell = endX; rowCell++) {
                indices.push(row * collectionWidth + rowCell);
            }
        }
        
        return indices;
    };
    
    RGBAPixelCollection.prototype.setPixelByIndex = function (index, color) {
        if (!(index in this.pixels)) {
            throw new RangeError('The index argument (' + JSON.stringify(index) + ') is not a valid index.');
        }
        
        if (!(color instanceof Object && 'r' in color && 'g' in color && 'b' in color && 'a' in color)) {
            throw new TypeError('The color argument (' + JSON.stringify(color) + ') is not a valid color.');
        }
        
        var pixel = this.pixels[index];
        
        pixel.r = color.r;
        pixel.g = color.g;
        pixel.b = color.b;
        pixel.a = color.a;
        
        return pixel;
    };
    
    RGBAPixelCollection.prototype.clone = function () {
        return new RGBAPixelCollection(this.raw);
    };
    
    RGBAPixelCollection.prototype.toSimpleImageData = function () {
        var imageData = {width: this.width, height: this.height},
            pixels = this.pixels,
            data = new Uint8ClampedArray(this.width * this.height);
        
        for (var i = 0; i < pixels.length; i+= 4) {
            var currentPixel = pixels[i];
            
            data[i] = currentPixel.r;
            data[i + 1] = currentPixel.g;
            data[i + 2] = currentPixel.b;
            data[i + 3] = currentPixel.a;
        }
        
        imageData.data = data;
        
        return imageData;
    };
    
    RGBAPixelCollection.prototype.toImage = function () {
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            
            image = document.createElement('img'),
            
            pixels = this.pixels,
            size = pixels.length,
            
            width = this.width,
            height = this.height;
        
        canvas.width = width;
        canvas.height = height;
        
        for (var i = 0; i < size; i++) {
            var pixel = pixels[i];
            
            ctx.fillStyle = 'rgba(' + pixel.r + ',' + pixel.g + ',' + pixel.b + ',' + pixel.a + ')';
            ctx.fillRect(i % width, Math.floor(i / width), 1, 1);
        }
        
        image.src = canvas.toDataURL();
        
        return image;
    };
    
    RGBAPixelCollection.prototype.toDataURL = function () {
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            
            pixels = this.pixels,
            size = pixels.length,
            
            width = this.width,
            height = this.height;
        
        canvas.width = width;
        canvas.height = height;
        
        for (var i = 0; i < size; i++) {
            var pixel = pixels[i];
            
            ctx.fillStyle = 'rgba(' + pixel.r + ',' + pixel.g + ',' + pixel.b + ',' + pixel.a + ')';
            ctx.fillRect(i % width, Math.floor(i / width), 1, 1);
        }
        
        return canvas.toDataURL();
    };
    
    function validateProps(obj, constructor) {
        if (obj === undefined || obj === null || typeof constructor !== 'function' || !(obj instanceof constructor)) {
            return false;
        }
        
        var numOfArgs = arguments.length;
        
        for (var i = 2; i < numOfArgs; i += 2) {
            var prop = arguments[i],
                propType = arguments[i + 1];
            
            if (typeof propType === 'function' && !(prop instanceof propType)) {
                return false;
            }
            
            if (typeof propType === 'string' && typeof prop === propType) {
                return false;
            }
        }
        
        return true;
    }
    
    window['Pixelator'] = Pixelator;
})();
