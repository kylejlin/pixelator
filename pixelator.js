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
        // Work on this tomorrow. GBMH.
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
    };
})();
