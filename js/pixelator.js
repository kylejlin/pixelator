(function () {
    /** Pixelator class. **/
    
    function Pixelator(imageData) {
        if (!validateProps(imageData, Object, 'width', 'number', 'height', 'number', 'data', Uint8ClampedArray)) {
            throw new TypeError('The first argument passed into the Pixelator constructor was not a valid ImageData object.');
        }
        
        this.width = imageData.width;
        this.height = imageData.height;
        this.data = imageData.data;
        
        this.canvas_ = document.createElement('canvas');
        this.canvas_.width = this.width;
        this.canvas_.height = this.height;
        
        this.ctx_ = this.canvas_.getContext('2d');
        this.ctx_.putImageData(imageData, 0, 0);
    }
    
    Pixelator.prototype.pixelate = function (sectionWidth, sectionHeight) {
        var sections = this.getAllSections(sectionWidth, sectionHeight),
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            i = sections.length;
        
        while (i--) {
            var section = sections[i],
                average = this.getAverageColor(section);
            
            ctx.fillStyle = 'rgba(' + average.r + ',' + average.g + ',' + average.b + ',' + average.a + ')';
            ctx.fillRect(section.x, section.y, section.width, section.height);
        }
        
        return ctx;
    };
    
    Pixelator.prototype.getAllSections = function (sectionWidth, sectionHeight) {
        var sections = [],
            
            rightEdgeSectionWidth = this.width % sectionWidth,
            bottomEdgeSectionHeight = this.height % sectionHeight,
            
            rightEdgeSectionX = this.width - rightEdgeSectionWidth,
            bottomEdgeSectionY = this.height - bottomEdgeSectionHeight;
        
        function addAllSectionsForRow(y, height) {
            sections.push(new Section(rightEdgeSectionX, y, rightEdgeSectionWidth, height));
            
            var x = rightEdgeSectionX - sectionWidth;
            
            while (x >= 0) {
                sections.push(new Section(x, y, sectionWidth, height));
                
                x -= sectionWidth;
            }
        }
        
        addAllSectionsForRow(bottomEdgeSectionY, bottomEdgeSectionHeight);
        
        var y = bottomEdgeSectionY - sectionHeight;
        
        while (y >= 0) {
            addAllSectionsForRow(y, sectionHeight);
            
            y -= sectionHeight;
        }
        
        return sections;
    };
    
    Pixelator.prototype.getAverageColor = function (section) {
        var pixels = this.pixelCollection,
            data = this.ctx_.getImageData(section.x, section.y, section.width, section.height),
            
            sumColor = {r: 0, g: 0, b: 0, a: 0},
            avgColor = {},
            
            len = data.length,
            i = len;//needs serious fixing
        
        while (i) {
            var pixel = pixels[indices[i]];
            
            sumColor.r += pixel.r;
            sumColor.g += pixel.g;
            sumColor.b += pixel.b;
            sumColor.a += pixel.a;
        }
        
        avgColor.r = sumColor.r / len;
        avgColor.g = sumColor.g / len;
        avgColor.b = sumColor.b / len;
        avgColor.a = sumColor.a / len;
        
        return avgColor;
    };
    
    Pixelator.prototype.filters_ = [];
    
    /** Section class. **/
    
    function Section(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
    
    /** Miscellaneous utilities. **/
    
    function validateProps(obj, constructor) {
        if (!(obj instanceof Object) || typeof constructor !== 'function' || !(obj instanceof constructor)) {
            return false;
        }
        
        var numOfArgs = arguments.length;
        
        for (var i = 2; i < numOfArgs; i += 2) {
            var prop = obj[arguments[i]],
                propType = arguments[i + 1],
                propTypeType = typeof propType;
            
            if (
                (propTypeType === 'function' && !(prop instanceof propType)) ||
                (propTypeType === 'string' && typeof prop !== propType) ||
                (propTypeType !== 'function' && propTypeType !== 'string')
            ) {
                return false;
            }
        }
        
        return true;
    }
    
    function multiValueTypeCheck(type) {
        var typeType = typeof type,
            i = arguments.length;
        
        if (typeType === 'function') {
            while (--i) { // Skip first argument (which is the type argument).
                if (!(arguments[i] instanceof type)) {
                    return false;
                }
            }
        } else if (typeType === 'string') {
            while (--i) {
                if (typeof arguments[i] !== type) {
                    return false;
                }
            }
        } else return true;
    }
    
    window['Pixelator'] = Pixelator;
})();
