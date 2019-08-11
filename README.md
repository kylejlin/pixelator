# Pixelator

A PWA that pixelates images.

Click [here](https://kylejlin.github.io/pixelator) to check it out.

## Project structure

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

It uses [React App Rewired](https://github.com/timarney/react-app-rewired) as a wrapper around CRA in order to support Web Workers, which are used to pixelate on a non-blocking thread.

## Pixelation algorithm

1. Divide up the image into rectangular sections.
2. For each section, calculate the average color of all the pixels and set every pixel to that average color.

## License

MIT

Copyright (c) 2016 Kyle Lin

Copyright (c) 2019 Kyle Lin
