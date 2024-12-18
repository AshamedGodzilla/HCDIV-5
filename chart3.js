// Data for migration patterns
const data3 = [
  { region: "Central", percentage: 35 },
  { region: "East", percentage: 20 },
  { region: "West", percentage: 25 },
  { region: "North", percentage: 12 },
  { region: "South", percentage: 8 }
];

// Set dimensions for the chart
const width3 = 800;
const height3 = 400;
const margin3 = { top: 40, right: 60, bottom: 60, left: 60 };
const radius = Math.min(width3, height3) / 2 - margin3.top;

// Create SVG container
const svg3 = d3.select("#chart3")
  .append("svg")
  .attr("width", width3)
  .attr("height", height3)
  .append("g")
  .attr("transform", `translate(${width3/2}, ${height3/2})`);

// Create color scale
const color = d3.scaleOrdinal()
  .domain(data3.map(d => d.region))
  .range(["#FF9F43", "#FF6B6B", "#4ECDC4", "#45B7D1", "#A8E6CF"]);

// Create pie chart
const pie = d3.pie()
  .value(d => d.percentage);

const arc = d3.arc()
  .innerRadius(radius * 0.5)
  .outerRadius(radius * 0.8);

const outerArc = d3.arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9);

// Add the arcs
const arcs = svg3.selectAll("arc")
  .data(pie(data3))
  .enter()
  .append("g")
  .attr("class", "arc");

arcs.append("path")
  .attr("d", arc)
  .attr("fill", d => color(d.data.region))
  .attr("stroke", "white")
  .style("stroke-width", "2px")
  .on("mouseover", function(event, d) {
    d3.select(this).style("opacity", 0.8);
    tooltip.style("display", "block")
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 20) + "px")
      .html(`Region: ${d.data.region}<br>Percentage: ${d.data.percentage}%`);
  })
  .on("mouseout", function() {
    d3.select(this).style("opacity", 1);
    tooltip.style("display", "none");
  });

// Add labels
const labelArc = d3.arc()
  .innerRadius(radius * 0.6)
  .outerRadius(radius * 0.6);

arcs.append("text")
  .attr("transform", d => `translate(${labelArc.centroid(d)})`)
  .attr("text-anchor", "middle")
  .style("fill", "white")
  .style("font-size", "12px")
  .text(d => `${d.data.region}\n${d.data.percentage}%`);

// Add title
svg3.append("text")
  .attr("x", 0)
  .attr("y", -height3/2 + margin3.top)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("fill", "white")
  .text("Migration Distribution by Region"); 