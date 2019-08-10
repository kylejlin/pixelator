import React from "react";
import "./App.css";

import Step from "./components/Step";

import readFileAsHtmlImage from "./readFileAsHtmlImage";

export default class App extends React.Component<{}, State> {
  private originalCanvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: {}) {
    super(props);

    this.state = {
      stepsCompleted: 0
    };

    this.originalCanvasRef = React.createRef();

    this.bindMethods();
  }

  private bindMethods() {
    this.onFileInputChange = this.onFileInputChange.bind(this);
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
              onChange={this.onFileInputChange}
            />

            {this.state.stepsCompleted >= 1 && (
              <div>
                <p className="SuccessfulUploadNotification">
                  Your image has been successfully uploaded!
                </p>
              </div>
            )}
          </Step>

          <Step number={2} instructions="Choose pixel size.">
            <label className="PixelDimensionLabel">
              Width: <input type="number" value={10} />
              px
            </label>
            <label className="PixelDimensionLabel">
              Height: <input type="number" value={10} />
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
            <button>Pixelate it!</button>
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

  onFileInputChange(e: React.ChangeEvent) {
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

          this.setState({ stepsCompleted: 1 });
        });
      } else {
        throw new TypeError(
          `Uploaded file format "${file.name}" is not supported.`
        );
      }
    }
  }
}

interface State {
  stepsCompleted: number;
}
