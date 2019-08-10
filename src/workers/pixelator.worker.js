const pixelateSync = require("../expensiveAlgorithms/pixelateSync").default;

self.addEventListener("message", event => {
  const { data } = event;

  switch (data.type) {
    case "pixelate":
      try {
        const originalImgData = {
          data: new Uint8ClampedArray(data.imgBuffer),
          width: data.imgWidth,
          height: data.imgHeight
        };
        const pixelatedImgData = pixelateSync(
          originalImgData,
          data.pixelWidth,
          data.pixelHeight
        );
        self.postMessage(
          {
            type: "succeeded",
            imgWidth: pixelatedImgData.width,
            imgHeight: pixelatedImgData.height,
            imgBuffer: pixelatedImgData.data.buffer
          },
          [pixelatedImgData.data.buffer]
        );
      } catch (error) {
        self.postMessage({ type: "failed", error });
      }
    default:
      throw new TypeError("Unexpected message type: " + event.data.type);
  }
});
