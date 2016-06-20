(function () {
    function Pixelator(image) {
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            width = image.width,
            height = image.height,
            imageData;
        
        this.width = width;
        this.height = height;
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(image, 0, 0, width, height);
        
        imageData = ctx.getImageData(0, 0, width, height);
        this.pixelCollection = new RGBAPixelCollection(imageData);
    }

    Pixelator.prototype.pixelize = function (bigPixelWidth, bigPixelHeight) {
        if (typeof bigPixelWidth !== 'number' || bigPixelWidth <= 0) {
            throw new TypeError('The width argument (arguments[0]) must be a non-zero number!');
        }
        if (typeof bigPixelHeight !== 'number' || bigPixelHeight <= 0) {
            throw new TypeError('The height argument (arguments[1]) must be a non-zero number!');
        }
        
        bigPixelWidth = Math.floor(bigPixelWidth);
        bigPixelHeight = Math.floor(bigPixelHeight);
    
        var pixels = this.pixelCollection.pixels,
            length = pixels.length,
            newImageBytes = new Uint8ClampedArray(this.pixelCollection.width * this.pixelCollection.height * 4),
            i, j, k;
        
        for (i = 0; i < length; i++) {
            var pixel = pixels[i];
            // I think this is wrong. Fix tomorrow.
            
        }
    };
    
    function RGBAPixelCollection(imageData) {
        this.width = imageData.width;
        this.height = imageData.height;
        this.pixels = [];
        
        var data = imageData.data,
            length = data.length,
            i;
            
        for (i = 0; i < length; i+= 4) {
            var red = data[i],
                green = data[i + 1],
                blue = data[i + 2],
                alpha = data[i + 3];
                
            this.pixels.push({r: red, g: green, b: blue, a: alpha});
        }
    }
    
    RGBAPixelCollection.prototype.toSimpleImageData = function () {
        var simpleImageData = new Uint8ClampedArray(this.pixels.length * 4),
            length = simpleImageData.length,
            i;
        
        for (i = 0; i < length; i++) {
            var pixel = this.pixels[i],
                dataIndexBase = i * 4;
            
            simpleImageData[dataIndexBase] = pixel.r;
            simpleImageData[dataIndexBase + 1] = pixel.g;
            simpleImageData[dataIndexBase + 2] = pixel.b;
            simpleImageData[dataIndexBase + 3] = pixel.a;
        }
        
        return {data: simpleImageData, width: this.width, height: this.height};
    };
    
    window['Pixelator'] = Pixelator;
})();
