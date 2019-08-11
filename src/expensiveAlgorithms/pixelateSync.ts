export default function pixelateSync(
  imgData: ImageData,
  pixelWidth: number,
  pixelHeight: number
): ImageData {
  return new Pixelator(imgData, pixelWidth, pixelHeight).pixelate();
}

class Pixelator {
  private imgWidth: number;
  private imgHeight: number;
  private originalPixelBytes: Uint8ClampedArray;
  private pixelatedPixelBytes: Uint8ClampedArray;
  private isUsed: boolean;

  constructor(
    imgData: ImageData,
    private pixelWidth: number,
    private pixelHeight: number
  ) {
    this.imgWidth = imgData.width;
    this.imgHeight = imgData.height;
    this.originalPixelBytes = imgData.data;
    this.pixelatedPixelBytes = new Uint8ClampedArray(
      this.originalPixelBytes.length
    );
    this.isUsed = false;
  }

  pixelate(): ImageData {
    this.assertUnused();
    this.isUsed = true;

    const sections = this.getAllSections();
    let i = sections.length;

    while (i--) {
      const section = sections[i];
      const color = this.getAverageColor(section);
      this.drawRect(section, color);
    }

    return {
      width: this.imgWidth,
      height: this.imgHeight,
      data: this.pixelatedPixelBytes
    };
  }

  private assertUnused() {
    if (this.isUsed) {
      throw new TypeError("Pixelator has already been used.");
    }
  }

  private getAllSections(): Section[] {
    const { pixelWidth, pixelHeight } = this;
    const sections: Section[] = [];

    let y = 0;
    while (y < this.imgHeight) {
      const height = Math.min(this.imgHeight - y, pixelHeight);

      let x = 0;
      while (x < this.imgWidth) {
        const width = Math.min(this.imgWidth - x, pixelWidth);
        sections.push({ x, y, width, height });
        x += width;
      }

      y += height;
    }

    return sections;
  }

  private getAverageColor(section: Section): Rgba {
    const pixelComponents = this.originalBytesAt(section);
    const sumColor = { r: 0, g: 0, b: 0, a: 0 };
    const len = pixelComponents.length;
    const numOfPixels = len / 4;
    let i = 0;

    while (i < len) {
      sumColor.r += pixelComponents[i++];
      sumColor.g += pixelComponents[i++];
      sumColor.b += pixelComponents[i++];
      sumColor.a += pixelComponents[i++];
    }

    return {
      r: (sumColor.r / numOfPixels) & 255,
      g: (sumColor.g / numOfPixels) & 255,
      b: (sumColor.b / numOfPixels) & 255,
      a: (sumColor.a / numOfPixels) & 255
    };
  }

  private originalBytesAt(section: Section): Uint8ClampedArray {
    const bytes = new Uint8ClampedArray(section.width * section.height * 4);
    const startX = section.x;
    const endX = section.x + section.width;
    const startY = section.y;
    const endY = section.y + section.height;
    for (let y = startY; y < endY; y++) {
      const localY = y - startY;
      const rowBytes = this.originalPixelBytes.slice(
        (y * this.imgWidth + startX) * 4,
        (y * this.imgWidth + endX) * 4
      );
      bytes.set(rowBytes, localY * section.width * 4);
    }
    return bytes;
  }

  private drawRect(section: Section, color: Rgba) {
    const startX = section.x;
    const endX = section.x + section.width;
    const startY = section.y;
    const endY = section.y + section.height;
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const { r, g, b, a } = color;
        const pixelIndex = (y * this.imgWidth + x) * 4;
        this.pixelatedPixelBytes.set([r, g, b, a], pixelIndex);

        if (y === endY - 1 && x === endX - 1) {
        }
      }
    }
  }
}

interface Section {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}
