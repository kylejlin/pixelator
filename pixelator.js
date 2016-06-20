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

    Pixelator.prototype.pixelize = function (pixelWidth, pixelHeight) {
        if (typeof pixelWidth !== 'number' || pixelWidth <= 0) {
            throw new TypeError('The pixelWidth argument (arguments[0]) must be a non-zero number!');
        }
        if (typeof pixelHeight !== 'number' || pixelHeight <= 0) {
            throw new TypeError('The pixelHeight argument (arguments[1]) must be a non-zero number!');
        }
        
        pixelWidth = Math.floor(pixelWidth);
        pixelHeight = Math.floor(pixelHeight);
    
        var pixels = this.pixelCollection.pixels,
            length = pixels.length,
            data = new Uint8ClampedArray(this.pixelCollection.width * this.pixelCollection.height * 4),
            i;
        
        for (i = 0; i < length; i++) {
            var pixel = pixels[i];
            
            
        }
    };
})();
