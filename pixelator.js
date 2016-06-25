(function () {
    function Pixelator(imageData) {
        if (!(imageData instanceof Object && typeof imageData.width === 'number' && typeof imageData.height === 'number' && (imageData.data) instanceof Uint8ClampedArray)) {
            throw new TypeError('The first argument passed into the Pixelator constructor was not a valid ImageData object.');
        }
        
        this.width = imageData.width;
        this.height = imageData.height;
        this.pixelCollection = new RGBAPixelCollection(imageData);
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
            averageColor.b = Math.round(sumColor.b / numberOfPixels):
            averageColor.a = Math.round(sumColor.a / numberOfPixels);
            
            for (j = 0; j < sectionIndices.length; j++) {
                
            }
            
            for (var f = 0; f < filter.length; f++) {
                filters[f].applyFilter(sumColor, this);
            }
        }
    };
    
    Pixelator.prototype.getAllSectionInfo = function (sectionWidth, sectionHeight) {
        var allSectionInfo = [],
            x = 0,
            y = 0,
            endX = this.width - 1,
            endY = this.hieght - 1;
        
        while (endY - y >= sectionHeight) {
            x = 0;
            
            while (endX - x >= sectionWidth) {
                allSectionInfo.push({x: x, y: y, width: sectionWidth, height: sectionHeight});
                
                x += sectionWidth;
            }
            
            if (x < endX) {
                allSectionInfo.push({x: x, y: y, width: endX - x, height: sectionHeight})
            }
            
            y + = sectionHeight;
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
    
    function RGBAPixelCollection (imageData) {
        if (!(imageData instanceof Object && typeof imageData.width === 'number' && typeof imageData.height === 'number')) {
            throw new TypeError('The first argument passed into the RGBAPixelCollection constructor was not a valid ImageData object.');
        }
        
        this.width = imageData.width;
        this.height = imageData.height;
        this.pixels = [];
        
        var data = imageData.data;
        
        if (data instanceof Uint8ClampedArray) {
            for (var i = 0; i < imageData.data.length; i+= 4) {
                this.pixels.push({
                    r: data[i],
                    g: data[i + 1],
                    b: data[i + 2],
                    a: data[i + 3]
                });
            }
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
})();
