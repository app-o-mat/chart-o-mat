# chart-o-mat

A very small JavaScript chart helper with **no npm/build step**.

## Structure

- `src/chart-o-mat.js` — entry point that imports chart modules
- `src/barChart.js` — bar chart implementation
- `examples/minimal.html` — minimal demo page

## Dependency

This library expects D3 to be loaded globally (`d3`).

Example CDN include:

```html
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
```

## Quick start

1. Open `examples/minimal.html` in a browser.
2. You should see a simple bar chart.

## API

```js
ChartOMat.renderBarChart(selector, data, options)
```

- `selector`: CSS selector for the chart container.
- `data`: array like `[{ label: 'A', value: 10 }]`.
- `options` (optional): `{ width, height, margin }`.
