// Data for population age structure
const data2 = [
  { age: "0-14", percentage: 14.3 },
  { age: "15-24", percentage: 12.8 },
  { age: "25-54", percentage: 50.2 },
  { age: "55-64", percentage: 13.1 },
  { age: "65+", percentage: 9.6 }
];

// Set dimensions for the chart
const width2 = 800;
const height2 = 400;
const margin2 = { top: 40, right: 60, bottom: 60, left: 60 };

// Create SVG container
const svg2 = d3.select("#chart2")
  .append("svg")
  .attr("width", width2 + margin2.left + margin2.right)
  .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
  .attr("transform", `translate(${margin2.left}, ${margin2.top})`);

// Create scales
const xScale2 = d3.scaleBand()
  .domain(data2.map(d => d.age))
  .range([0, width2])
  .padding(0.1);

const yScale2 = d3.scaleLinear()
  .domain([0, d3.max(data2, d => d.percentage)])
  .range([height2, 0]);

// Create and add axes
svg2.append("g")
  .attr("transform", `translate(0, ${height2})`)
  .call(d3.axisBottom(xScale2));

svg2.append("g")
  .call(d3.axisLeft(yScale2).tickFormat(d => d + "%"));

// Create bars
svg2.selectAll("rect")
  .data(data2)
  .enter()
  .append("rect")
  .attr("x", d => xScale2(d.age))
  .attr("y", d => yScale2(d.percentage))
  .attr("width", xScale2.bandwidth())
  .attr("height", d => height2 - yScale2(d.percentage))
  .attr("fill", "#4facfe")
  .on("mouseover", function(event, d) {
    d3.select(this).attr("fill", "#007bff");
    tooltip.style("display", "block")
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 20) + "px")
      .html(`Age Group: ${d.age}<br>Percentage: ${d.percentage}%`);
  })
  .on("mouseout", function() {
    d3.select(this).attr("fill", "#4facfe");
    tooltip.style("display", "none");
  });

// Add title and labels
svg2.append("text")
  .attr("x", width2 / 2)
  .attr("y", -10)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("fill", "white")
  .text("Singapore Population Age Structure");

svg2.append("text")
  .attr("x", width2 / 2)
  .attr("y", height2 + 40)
  .attr("text-anchor", "middle")
  .style("fill", "white")
  .text("Age Groups");

svg2.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -height2 / 2)
  .attr("y", -40)
  .attr("text-anchor", "middle")
  .style("fill", "white")
  .text("Percentage (%)"); 