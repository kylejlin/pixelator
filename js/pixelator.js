(function () {
    function Pixelator(imageData) {
        if (!(imageData instanceof Object && typeof imageData.width === 'number' && typeof imageData.height === 'number' && (imageData.data) instanceof Uint8ClampedArray)) {
            throw new TypeError('The first argument passed into the Pixelator constructor was not a valid ImageData object.');
        }
        
        this.width = imageData.width;
        this.height = imageData.height;
        this.pixelCollection = new RGBAPixelCollection(imageData);
        this.rawImageData = imageData;
    }
    
    Pixelator.prototype.pixelate = function (sectionWidth, sectionHeight) {
        var allSectionInfo = this.getAllSectionInfo(sectionWidth, sectionHeight),
            filters = this.filters_,
            pixelatedImage = this.pixelCollection.clone();
        
        for (var i = 0; i < allSectionInfo.length; i++) {
            var sectionInfo = allSectionInfo[i],
                
                x = sectionInfo.x,
                y = sectionInfo.y,
                w = sectionInfo.width,
                h = sectionInfo.height,
                
                sectionIndices = this.pixelCollection.getIndicesInRect(x, y, w, h),
                
                numberOfPixels = sectionIndices.length,
                
                sumColor = {r: 0, g: 0, b: 0, a: 0},
                averageColor = {};
            
            for (var j = 0; j < numberOfPixels; j++) {
                var pixel = sectionIndices[j];
                
                sumColor.r += pixel.r;
                sumColor.g += pixel.g;
                sumColor.b += pixel.b;
                sumColor.a += pixel.a;
            }
            
            averageColor.r = Math.round(sumColor.r / numberOfPixels);
            averageColor.g = Math.round(sumColor.g / numberOfPixels);
            averageColor.b = Math.round(sumColor.b / numberOfPixels);
            averageColor.a = Math.round(sumColor.a / numberOfPixels);
            
            for (var f = 0; f < filter.length; f++) {
                filters[f].applyFilter(sumColor, this);
            }
            
            for (j = 0; j < sectionIndices.length; j++) {
                pixelatedImage.setPixelByIndex(sectionIndices[j], averageColor);
            }
        }
        
        return pixelatedImage;
    };
    
    Pixelator.prototype.getAllSectionInfo = function (sectionWidth, sectionHeight) {
        var allSectionInfo = [],
        
            x = 0,
            y = 0,
            
            endX = this.width - 1,
            endY = this.height - 1;
        
        while (endY - y >= sectionHeight) {
            x = 0;
            
            while (endX - x >= sectionWidth) {
                allSectionInfo.push({x: x, y: y, width: sectionWidth, height: sectionHeight});
                
                x += sectionWidth;
            }
            
            if (x < endX) {
                allSectionInfo.push({x: x, y: y, width: endX - x, height: sectionHeight})
            }
            
            y += sectionHeight;
        }
        
        if (y < endY) {
            x = 0;
            
            while (endX - x >= sectionWidth) {
                allSectionInfo.push({x: x, y: y, width: sectionWidth, height: endY - y});
                
                x += sectionWidth;
            }
            
            if (x < endX) {
                allSectionInfo.push({x: x, y: y, width: endX - x, height: endY - y});
            }
        }
        
        return allSectionInfo;
    };
    
    Pixelator.prototype.filters_ = [];
    
    function RGBAPixelCollection (imageData) {
        if (!(imageData instanceof Object && typeof imageData.width === 'number' && typeof imageData.height === 'number')) {
            throw new TypeError('The first argument passed into the RGBAPixelCollection constructor was not a valid ImageData object.');
        }
        
        this.width = imageData.width;
        this.height = imageData.height;
        this.pixels = [];
        
        var data = imageData.data;
        
        if (data instanceof Uint8ClampedArray) {
            this.raw = imageData;
            
            for (var i = 0; i < data.length; i+= 4) {
                this.pixels.push({
                    r: data[i],
                    g: data[i + 1],
                    b: data[i + 2],
                    a: data[i + 3]
                });
            }
        } else {
            var size = this.width * this.height;
            
            for (var i = 0; i < size; i++) {
                this.pixels.push({
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 255
                });
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
    
    window['Pixelator'] = Pixelator;
})();
