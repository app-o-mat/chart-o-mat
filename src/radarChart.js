import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// radarData looks like this:
// {
//     axes: [
//         [
//             { label: "Visibility", angle: 0, metric: (i) => i.visibility },
//             { label: "", angle: 20, metric: (i) => (i.visibility + i.misalignment) / 2 },
//             { label: "Misalignment", angle: 40, metric: (i) => i.misalignment }
//         ],
//         [
//             { label: "Regressions", angle: 180, metric: (i) => i.regressions }
//         ]
//     ],
//     data: [
//         { id: 1, name: "Debt Item 1", visibility: 3, misalignment: 4, resistance: 2, volatility: 5, regressions: 1, uncertainty: 2, size: 4, difficulty: 3, color: "#ff0000" },
//         { id: 2, name: "Debt Item 2", visibility: 2, misalignment: 3, resistance: 4, volatility: 1, regressions: 5, uncertainty: 3, size: 2, difficulty: 4, color: "#00ff00" },
//         { id: 3, name: "Debt Item 3", visibility: 4, misalignment: 2, resistance: 5, volatility: 3, regressions: 2, uncertainty: 4, size: 3, difficulty: 5, color: "#0000ff" }
//     ]
// }

// options looks like this:
// {
//     includedIds: [1, 3] // array of debt item ids to include in the radar chart
// }

// Main function to draw the radar chart
export function renderRadarChart(selector, radarData, options = {}) {
    // Clear any existing chart
    d3.select(selector).selectAll("*").remove();
    
    const size = 600;
    
    // Set up margins and dimensions
    const margin = { top: 60, right: 80, bottom: 60, left: 80 };
    const innerWidth = size - margin.left - margin.right;
    const innerHeight = size - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;
    
    // Create SVG container
    const svg = d3.select(selector)
        .append("svg")
        .attr("width", size)
        .attr("height", size)
        .attr("style", "background-color:transparent;");
    
    // Create main group centered
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left + innerWidth / 2},${margin.top + innerHeight / 2})`);
    
    const axisGroups = Array.isArray(radarData?.axes) ? radarData.axes : [];
    const axes = axisGroups.reduce((allAxes, group) => allAxes.concat(group || []), []);
    
    // Draw concentric circles
    drawConcentricCircles(g, radius);
    
    // Draw vertical center line extending past the outermost circle
    const lineExtension = 50; // How much to extend past the outer circle
    g.append("line")
        .attr("x1", 0)
        .attr("y1", -(radius + lineExtension))
        .attr("x2", 0)
        .attr("y2", radius + lineExtension)
        .attr("stroke", "#666")
        .attr("stroke-width", 2);
    
    // Draw radial axes
    drawRadialAxes(g, radius, axes);
    
    // Draw radar lines for debt items
    // Filter debt items based on checkboxes
    const checkedItems = options.includedIds || [];
    
    if (radarData?.data) {
        const filteredItems = radarData.data.filter(item => checkedItems.includes(item.id));
        let axisStart = 0;
        axisGroups.forEach((group) => {
            const groupLength = (group || []).length;
            const groupAxes = axes.slice(axisStart, axisStart + groupLength);
            drawRadarLines(g, radius, groupAxes, filteredItems);
            axisStart += groupLength;
        });
    }
}

// Function to draw 5 concentric circles
function drawConcentricCircles(container, radius) {
    const levels = 5;
    
    for (let i = 1; i <= levels; i++) {
        const r = (radius / levels) * i;
        container.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", r)
            .attr("fill", "none")
            .attr("stroke", isDarkMode ? "#ccc" : "#333")
            .attr("stroke-width", 1);
    }
}

// Function to draw radial axes with labels
function drawRadialAxes(container, radius, axes) {
    axes.filter(axis => axis.label).forEach(axis => {
        // Convert degrees to radians
        const angleRad = -(axis.angle) * Math.PI / 180;
        
        // Calculate end point of the line
        const x = radius * Math.cos(angleRad);
        const y = radius * Math.sin(angleRad);
        
        // Draw the radial line
        container.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", x)
            .attr("y2", y)
            .attr("stroke", "#666")
            .attr("stroke-width", 2);
        
        // Calculate label position (slightly beyond the radius)
        const labelDistance = radius + 30;
        const labelX = labelDistance * Math.cos(angleRad);
        const labelY = labelDistance * Math.sin(angleRad);
        
        // Add label
        container.append("text")
            .attr("x", labelX)
            .attr("y", labelY)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", isDarkMode ? "#ccc" : "#333")
            .text(axis.label);
    });
}

// Function to draw radar lines for debt items
function drawRadarLines(container, radius, axes, debtItems) {
    debtItems.forEach(item => {
        // Calculate points for this item
        const points = axes.map(axis => {
            // Get the metric value (0-5 scale)
            const value = axis.metric(item);
            
            // Calculate distance from center (normalized to radius)
            const distance = (value / 5) * radius;
            
            // Convert degrees to radians
            const angleRad = -(axis.angle) * Math.PI / 180;
            
            // Calculate x, y coordinates
            const x = distance * Math.cos(angleRad);
            const y = distance * Math.sin(angleRad);
            
            return [x, y];
        });

        // Close the polygon by putting [0, 0] at the beginning and the end
        points.unshift([0, 0]);
        points.push([0, 0]);

        // Create line generator with curve interpolation
        const lineGenerator = d3.line()
            .x(d => d[0])
            .y(d => d[1])
            .curve(d3.curveCardinalClosed.tension(0.5));
        
        // Draw the radar line
        container.append("path")
            .attr("d", lineGenerator(points))
            .attr("fill", item.color)
            .attr("fill-opacity", 0.7)
            .attr("stroke", item.color)
            .attr("stroke-width", 2)
            .attr("stroke-opacity", 1.0)
            .append("title")
            .text(item.name);
    });
}
