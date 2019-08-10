import React from "react";
import "./App.css";

import Step from "./components/Step";

import readFileAsHtmlImage from "./readFileAsHtmlImage";
import Option from "./Option";
import pixelateImage from "./pixelateImage";

export default class App extends React.Component<{}, State> {
  private originalCanvasRef: React.RefObject<HTMLCanvasElement>;
  private pixelatedCanvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: {}) {
    super(props);

    this.state = {
      originalImg: Option.none(),
      pixelWidthInputValue: "" + DEFAULT_PIXEL_SIZE,
      pixelHeightInputValue: "" + DEFAULT_PIXEL_SIZE,
      pixelationZone: Option.none()
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
      <div className="App">
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
            <canvas ref={this.originalCanvasRef} />
            <label>
              <input type="checkbox" checked={true} />
              Select all
            </label>
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
    this.state.originalImg.ifSome(img => {
      pixelateImage(img, this.pixelWidth(), this.pixelHeight()).then(
        imgData => {
          const canvas = this.pixelatedCanvasRef.current;
          if (canvas !== null) {
            canvas.width = imgData.width;
            canvas.height = imgData.height;
            const ctx = canvas.getContext("2d")!;
            ctx.putImageData(imgData, 0, 0);
          }
        }
      );
    });
  }
}

interface State {
  originalImg: Option<HTMLImageElement>;
  pixelWidthInputValue: string;
  pixelHeightInputValue: string;
  pixelationZone: Option<Rect>;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const DEFAULT_PIXEL_SIZE = 10;

function isLegalPixelSize(size: number): boolean {
  return !isNaN(size) && size > 0 && isInt(size);
}

function isInt(num: number): boolean {
  return Math.floor(num) === num;
}
