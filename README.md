# Pixelator

A PWA that pixelates images.

Click [here](https://kylejlin.github.io/pixelator) to check it out.

## Project structure

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

As of the time of writing this, Create React App doesn't support Web Workers out of the box. Consequently, a separate webpack project (under the `workers/` directory) is used to compile the workers. The output is written to `public/workers/`.

## Pixelation algorithm

1. Divide up the image into rectangular sections.
2. For each section, calculate the average color of all the pixels and set every pixel to that average color.

## License

MIT

Copyright (c) 2016 Kyle Lin

Copyright (c) 2019 Kyle Lin
