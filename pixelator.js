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
    this.pixels = new RGBAPixelCollection(imageData);
}

Pixelator.prototype.pixelize = function (pixelWidth, pixelHeight) {
    if (typeof pixelWidth !== 'number' || pixelWidth <= 0) {
        throw new TypeError('The pixelWidth argument (arguments[0]) must be a non-zero number!');
    }
    if (typeof pixelHeight !== 'number' || pixelHeight <= 0) {
        throw new TypeError('The pixelHeight argument (arguments[1]) must be a non-zero number!');
    }
    
    var pixels = this.pixels,
        length = pixels.length,
        i;
    
    for (i = 0; i < length; i++) {
        var pixel = pixels[i];
        
        
    }
};
