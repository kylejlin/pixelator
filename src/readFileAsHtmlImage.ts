export default function readFileAsHtmlImage(
  file: File
): Promise<HTMLImageElement> {
  return readFileAsDataUrl(file).then(
    url =>
      new Promise((resolve, reject) => {
        const img = document.createElement("img");
        img.src = url;
        img.addEventListener("load", () => resolve(img));
        img.addEventListener("error", reject);
      })
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as string));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}
