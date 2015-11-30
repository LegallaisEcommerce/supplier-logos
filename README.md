# Legallais suppliers logos

All logos added here must be SVG !

To minify them and add a png copy use the gulpfile.

## Installation

```sh
npm i
```

## Run

1. First, rename (lower-case.svg) and minify SVG

	```sh
	gulp svgo
	```

2. Create a png copy of each logo

	```sh
	gulp svg2png
	```

3. Minify png's

	```sh
	gulp minify-png
	```

4. All your optimized .svg and .png copies are now in the `dist/` folder.