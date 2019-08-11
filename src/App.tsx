import React from "react";
import "./App.css";

import Step from "./components/Step";

import pixelateImage from "./pixelateImage";
import readFileAsHtmlImage from "./readFileAsHtmlImage";
import Option from "./Option";

const PIXELATION_ZONE_LINE_WIDTH = 2;
const PIXELATION_ZONE_HANDLE_RADIUS = 10;
const PIXELATION_ZONE_COLOR = "#08b";
const NON_PRESERVED_INDICATOR_COLOR = "#000a";

export default class App extends React.Component<{}, State> {
  private originalCanvasRef: React.RefObject<HTMLCanvasElement>;
  private pixelatedCanvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: {}) {
    super(props);

    // @ts-ignore
    window.pixelator = this;

    this.state = {
      originalImg: Option.none(),
      pixelWidthInputValue: "" + DEFAULT_PIXEL_SIZE,
      pixelHeightInputValue: "" + DEFAULT_PIXEL_SIZE,
      pixelationZone: Option.none(),
      shouldPreserveNonPixelatedPortion: true,
      dragState: Option.none()
    };

    this.originalCanvasRef = React.createRef();
    this.pixelatedCanvasRef = React.createRef();

    this.bindMethods();
  }

  private bindMethods() {
    this.onFileChange = this.onFileChange.bind(this);
    this.onPixelWidthChange = this.onPixelWidthChange.bind(this);
    this.onPixelHeightChange = this.onPixelHeightChange.bind(this);
    this.syncPixelWidth = this.syncPixelWidth.bind(this);
    this.syncPixelHeight = this.syncPixelHeight.bind(this);
    this.onPixelateClick = this.onPixelateClick.bind(this);
    this.onShouldUseEntireImageChange = this.onShouldUseEntireImageChange.bind(
      this
    );
    this.onShouldPreserveNonPixelatedPortionChange = this.onShouldPreserveNonPixelatedPortionChange.bind(
      this
    );
    this.drawOrClearPixelationZone = this.drawOrClearPixelationZone.bind(this);
    this.onOriginalCanvasMouseDown = this.onOriginalCanvasMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  componentDidMount() {
    const originalCanvas = this.originalCanvasRef.current!;
    originalCanvas.width = 0;
    originalCanvas.height = 0;

    const pixelatedCanvas = this.pixelatedCanvasRef.current!;
    pixelatedCanvas.width = 0;
    pixelatedCanvas.height = 0;
  }

  render() {
    return (
      <div
        className="App"
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
      >
        <header>
          <h1>Pixelator</h1>
          <p className="HeaderDescription">
            An online tool for pixelating your images.
          </p>
        </header>

        <main>
          <Step number={1} instructions="Upload an image.">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.gif"
              onChange={this.onFileChange}
            />

            {this.state.originalImg.match({
              none: () => null,
              some: _img => (
                <div>
                  <p className="SuccessfulUploadNotification">
                    Your image has been successfully uploaded!
                  </p>
                </div>
              )
            })}
          </Step>

          <Step number={2} instructions="Choose pixel size.">
            <label className="PixelDimensionLabel">
              Width:{" "}
              <input
                type="text"
                pattern="\d*"
                value={this.state.pixelWidthInputValue}
                onChange={this.onPixelWidthChange}
                onBlur={this.syncPixelWidth}
              />
              px
            </label>
            <label className="PixelDimensionLabel">
              Height:{" "}
              <input
                type="text"
                pattern="\d*"
                value={this.state.pixelHeightInputValue}
                onChange={this.onPixelHeightChange}
                onBlur={this.syncPixelHeight}
              />
              px
            </label>
          </Step>

          <Step
            number={3}
            instructions="Choose the portion of the image to pixelate, or skip this step and the entire image will be pixelated."
          >
            <label>
              Select all
              <input
                type="checkbox"
                checked={this.state.pixelationZone.isNone()}
                onChange={this.onShouldUseEntireImageChange}
              />
            </label>
            {this.state.pixelationZone.isSome() && (
              <label>
                Preserve non-pixelated portion of image
                <input
                  type="checkbox"
                  checked={this.state.shouldPreserveNonPixelatedPortion}
                  onChange={this.onShouldPreserveNonPixelatedPortionChange}
                />
              </label>
            )}
            <canvas
              ref={this.originalCanvasRef}
              onMouseDown={this.onOriginalCanvasMouseDown}
            />
          </Step>

          <Step number={4} instructions="">
            <button onClick={this.onPixelateClick}>Pixelate it!</button>
            <canvas ref={this.pixelatedCanvasRef} />
          </Step>

          <footer>
            Pixelator's source code can be found on{" "}
            <a href="https://github.com/kyljelin/pixelator">Github</a> under the
            MIT License.
          </footer>
        </main>
      </div>
    );
  }

  onFileChange(e: React.ChangeEvent) {
    const { files } = e.target as HTMLInputElement;
    if (files !== null) {
      const file = files[0];
      if (file instanceof File && /\.(jpe?g|png|gif)$/i.test(file.name)) {
        readFileAsHtmlImage(file).then(img => {
          const canvas = this.originalCanvasRef.current!;
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);

          this.setState({ originalImg: Option.some(img) });
        });
      } else {
        throw new TypeError(
          `Uploaded file format "${file.name}" is not supported.`
        );
      }
    }
  }

  onPixelWidthChange(e: React.ChangeEvent) {
    this.setState({
      pixelWidthInputValue: (e.target as HTMLInputElement).value
    });
  }

  onPixelHeightChange(e: React.ChangeEvent) {
    this.setState({
      pixelHeightInputValue: (e.target as HTMLInputElement).value
    });
  }

  syncPixelWidth() {
    this.setState({ pixelWidthInputValue: "" + this.pixelWidth() });
  }

  syncPixelHeight() {
    this.setState({ pixelHeightInputValue: "" + this.pixelHeight() });
  }

  pixelWidth(): number {
    const parsed = parseInt(this.state.pixelWidthInputValue, 10);
    if (isLegalPixelSize(parsed)) {
      return parsed;
    } else {
      return DEFAULT_PIXEL_SIZE;
    }
  }

  pixelHeight(): number {
    const parsed = parseInt(this.state.pixelHeightInputValue, 10);
    if (isLegalPixelSize(parsed)) {
      return parsed;
    } else {
      return DEFAULT_PIXEL_SIZE;
    }
  }

  onPixelateClick() {
    this.state.originalImg.ifSome(originalImg => {
      const imgToPixelate = this.state.pixelationZone.match({
        none: () => originalImg,
        some: zone => cropImage(originalImg, zone)
      });
      pixelateImage(imgToPixelate, this.pixelWidth(), this.pixelHeight()).then(
        imgData => {
          const canvas = this.pixelatedCanvasRef.current;
          if (canvas !== null) {
            const ctx = canvas.getContext("2d")!;

            if (
              this.state.pixelationZone.isSome() &&
              this.state.shouldPreserveNonPixelatedPortion
            ) {
              const zone = this.state.pixelationZone.unwrap();
              canvas.width = originalImg.width;
              canvas.height = originalImg.height;
              ctx.drawImage(originalImg, 0, 0);
              ctx.putImageData(imgData, zone.x, zone.y);
            } else {
              canvas.width = imgData.width;
              canvas.height = imgData.height;
              ctx.putImageData(imgData, 0, 0);
            }
          }
        }
      );
    });
  }

  onShouldUseEntireImageChange(e: React.ChangeEvent) {
    const { checked } = e.target as HTMLInputElement;

    if (checked) {
      this.setState(
        { pixelationZone: Option.none() },
        this.drawOrClearPixelationZone
      );
    } else {
      this.state.originalImg.ifSome(img => {
        this.setState(
          {
            pixelationZone: Option.some({
              x: 0,
              y: 0,
              width: img.width,
              height: img.height
            })
          },
          this.drawOrClearPixelationZone
        );
      });
    }
  }

  drawOrClearPixelationZone() {
    const canvas = this.originalCanvasRef.current;
    if (canvas !== null) {
      this.state.originalImg.ifSome(img => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        this.state.pixelationZone.ifSome(zone => {
          if (!this.state.shouldPreserveNonPixelatedPortion) {
            const originalPixelsInPixelationZone = ctx.getImageData(
              zone.x,
              zone.y,
              zone.width,
              zone.height
            );

            ctx.fillStyle = NON_PRESERVED_INDICATOR_COLOR;
            ctx.fillRect(0, 0, img.width, img.height);

            ctx.putImageData(originalPixelsInPixelationZone, zone.x, zone.y);
          }

          ctx.lineWidth = PIXELATION_ZONE_LINE_WIDTH;
          ctx.strokeStyle = PIXELATION_ZONE_COLOR;
          ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);

          ctx.fillStyle = PIXELATION_ZONE_COLOR;
          fillCircle(ctx, zone.x, zone.y, PIXELATION_ZONE_HANDLE_RADIUS);
          fillCircle(
            ctx,
            zone.x + zone.width,
            zone.y,
            PIXELATION_ZONE_HANDLE_RADIUS
          );
          fillCircle(
            ctx,
            zone.x,
            zone.y + zone.height,
            PIXELATION_ZONE_HANDLE_RADIUS
          );
          fillCircle(
            ctx,
            zone.x + zone.width,
            zone.y + zone.height,
            PIXELATION_ZONE_HANDLE_RADIUS
          );
        });
      });
    }
  }

  onShouldPreserveNonPixelatedPortionChange(e: React.ChangeEvent) {
    const target = e.target as HTMLInputElement;
    this.setState(
      { shouldPreserveNonPixelatedPortion: target.checked },
      this.drawOrClearPixelationZone
    );
  }

  onOriginalCanvasMouseDown(e: React.MouseEvent) {
    this.state.pixelationZone.ifSome(zone => {
      const [canvasX, canvasY] = this.getOriginalCanvasCoords(
        e.clientX,
        e.clientY
      );

      this.setState({
        dragState: getDraggedCorner(
          canvasX,
          canvasY,
          zone,
          PIXELATION_ZONE_HANDLE_RADIUS
        ).map(corner => ({ corner, initialZone: zone }))
      });
    });
  }

  getOriginalCanvasCoords(clientX: number, clientY: number): [number, number] {
    const canvas = this.originalCanvasRef.current;
    if (canvas !== null) {
      const boundingRect = canvas.getBoundingClientRect();
      const dx = clientX - boundingRect.left;
      const dy = clientY - boundingRect.top;
      const canvasX = Math.round((canvas.width * dx) / boundingRect.width);
      const canvasY = Math.round((canvas.height * dy) / boundingRect.height);
      return [canvasX, canvasY];
    } else {
      throw new TypeError(
        "getOriginalCanvasCoords() was called when originalCanvasRef was null"
      );
    }
  }

  onMouseMove(e: React.MouseEvent) {
    this.state.dragState.ifSome(({ corner, initialZone }) => {
      const [canvasX, canvasY] = this.getOriginalCanvasCoords(
        e.clientX,
        e.clientY
      );

      this.setState(
        {
          pixelationZone: Option.some(
            updateCorner(initialZone, corner, canvasX, canvasY)
          )
        },
        this.drawOrClearPixelationZone
      );
    });
  }

  onMouseUp() {
    this.setState({
      dragState: Option.none()
    });
  }
}

interface State {
  originalImg: Option<HTMLImageElement>;
  pixelWidthInputValue: string;
  pixelHeightInputValue: string;
  pixelationZone: Option<Rect>;
  shouldPreserveNonPixelatedPortion: boolean;
  dragState: Option<{ corner: Corner; initialZone: Rect }>;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

enum Corner {
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight
}

const DEFAULT_PIXEL_SIZE = 10;

function isLegalPixelSize(size: number): boolean {
  return !isNaN(size) && size > 0 && isInt(size);
}

function isInt(num: number): boolean {
  return Math.floor(num) === num;
}

function getDraggedCorner(
  x: number,
  y: number,
  rect: Rect,
  handleRadius: number
): Option<Corner> {
  if (euclideanDistance(x, y, rect.x, rect.y) <= handleRadius) {
    return Option.some(Corner.TopLeft);
  } else if (
    euclideanDistance(x, y, rect.x + rect.width, rect.y) <= handleRadius
  ) {
    return Option.some(Corner.TopRight);
  } else if (
    euclideanDistance(x, y, rect.x, rect.y + rect.height) <= handleRadius
  ) {
    return Option.some(Corner.BottomLeft);
  } else if (
    euclideanDistance(x, y, rect.x + rect.width, rect.y + rect.height) <=
    handleRadius
  ) {
    return Option.some(Corner.BottomRight);
  } else {
    return Option.none();
  }
}

function euclideanDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.hypot(x1 - x2, y1 - y2);
}

function fillCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number
) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
}

function updateCorner(rect: Rect, corner: Corner, x: number, y: number): Rect {
  let left = rect.x;
  let right = rect.x + rect.width;
  let top = rect.y;
  let bottom = rect.y + rect.height;

  switch (corner) {
    case Corner.TopLeft:
      top = y;
      left = x;
      break;
    case Corner.TopRight:
      top = y;
      right = x;
      break;
    case Corner.BottomLeft:
      bottom = y;
      left = x;
      break;
    case Corner.BottomRight:
      bottom = y;
      right = x;
      break;
  }

  if (left > right) {
    [left, right] = [right, left];
  }
  if (top > bottom) {
    [top, bottom] = [bottom, top];
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top
  };
}

function cropImage(
  img: CanvasImageSource & { width: number; height: number },
  rect: Rect
): HTMLCanvasElement {
  const original = document.createElement("canvas");
  original.width = img.width;
  original.height = img.height;
  const originalCtx = original.getContext("2d")!;
  originalCtx.drawImage(img, 0, 0);
  const rectData = originalCtx.getImageData(
    rect.x,
    rect.y,
    rect.width,
    rect.height
  );

  const cropped = document.createElement("canvas");
  cropped.width = rect.width;
  cropped.height = rect.height;
  const croppedCtx = cropped.getContext("2d")!;
  croppedCtx.putImageData(rectData, 0, 0);
  return cropped;
}
