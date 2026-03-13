# chart-o-mat

A very small JavaScript chart helper with **no npm/build step**.

## Structure

- `src/chart-o-mat.js` — entry point that imports chart modules
- `src/radarChart.js` — radar chart implementation
- `examples/minimal.html` — minimal demo page

## Dependency

This library expects D3 to be loaded globally (`d3`).

Example CDN include:

```html
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
```

## Quick start

1. Open `examples/minimal.html` in a browser.
2. You should see a simple radar chart.

## API

```js
ChartOMat.renderRadarChart(selector, data, options)
```

---

### `ChartOMat.renderRadarChart(selector, radarData, options)`

Renders a radar chart into the DOM element specified by `selector` using the provided `radarData` and optional `options`.

**Parameters:**
- `selector` (`string`): CSS selector for the container element where the chart will be rendered.
- `radarData` (`object`): Data and axes definition for the radar chart. Should have the following structure:
  - `axes`: Array of axis groups. Each group is an array of axis objects:
    - `label` (`string`): Axis label. If blank, no radial line is drawn.
    - `angle` (`number`): Angle in degrees (0 at top, increases clockwise).
    - `metric` (`function`): Function that takes a data item and returns a value from 0 to 5.
  - `data`: Array of data items to plot. Each item should have:
    - `id` (`number`): Unique identifier.
    - `name` (`string`): Name for the item (used for color if no color is provided).
    - `color` (`string`, optional): Color for the radar line. If omitted, a color is chosen based on the name.
    - Additional properties as required by axis metric functions.

**Example `radarData`:**
```js
{
  axes: [
    [
      { label: "Visibility", angle: 0, metric: i => i.visibility },
      { label: "Misalignment", angle: 40, metric: i => i.misalignment }
    ],
    [
      { label: "Regressions", angle: 180, metric: i => i.regressions }
    ]
  ],
  data: [
    { id: 1, name: "Item 1", visibility: 3, misalignment: 4, regressions: 1, color: "#ff0000" },
    { id: 2, name: "Item 2", visibility: 2, misalignment: 3, regressions: 5 }
  ]
}
```

**Options:**
- `includedIds` (`number[]`, optional): Array of data item ids to include in the chart. Only items with ids in this array will be rendered.
- `circleColor` (`string`, optional): Stroke color for concentric circles.
- `radialLineColor` (`string`, optional): Stroke color for radial axis lines.
- `labelColor` (`string`, optional): Color for axis labels.

**Behavior:**
- Clears any existing chart in the container.
- Draws 5 concentric circles as the chart background.
- Draws a vertical center line and radial axes for each labeled axis.
- Plots radar polygons for each included data item, using the specified or computed color.
- Uses D3.js for rendering. Expects D3 to be loaded globally as `d3`.

---

## Attributions

This library includes `cyrb53` from https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js to generate default colors.