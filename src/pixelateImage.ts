import PixelatorWorker from "./workers/pixelator.worker";

export default function pixelateImage(
  img: HTMLImageElement,
  pixelWidth: number,
  pixelHeight: number
): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    const worker = new PixelatorWorker();
    const imgBuffer = htmlImageToBuffer(img);
    worker.postMessage(
      {
        type: "pixelate",
        pixelWidth,
        pixelHeight,
        imgWidth: img.width,
        imgHeight: img.height,
        imgBuffer
      },
      [imgBuffer]
    );

    worker.addEventListener("message", (e: MessageEvent) => {
      const { data } = e;

      switch (data.type) {
        case "succeeded":
          worker.terminate();
          resolve(
            new ImageData(
              new Uint8ClampedArray(data.imgBuffer),
              data.imgWidth,
              data.imgHeight
            )
          );
          break;

        case "failed":
          worker.terminate();
          reject(data.error);
          break;

        case "log":
          console.log(data.message);
          break;

        default:
          reject(new TypeError("Unexpected message type: " + data.type));
      }
    });
  });
}

function htmlImageToBuffer(img: HTMLImageElement): ArrayBuffer {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height).data.buffer;
}
