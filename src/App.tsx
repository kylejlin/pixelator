import React from "react";
import "./App.css";

import Step from "./components/Step";

export default class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {};
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
            <input type="file" accept="image/*" />
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
}

interface State {}
