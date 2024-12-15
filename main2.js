// Data for divorce and fertility rates (sample data)
const data = [
    { year: 2010, divorceRate: 3.5, fertilityRate: 1.2 },
    { year: 2012, divorceRate: 4.0, fertilityRate: 1.1 },
    { year: 2014, divorceRate: 4.2, fertilityRate: 1.0 },
    { year: 2016, divorceRate: 4.5, fertilityRate: 0.9 },
    { year: 2018, divorceRate: 4.8, fertilityRate: 0.85 },
    { year: 2020, divorceRate: 5.0, fertilityRate: 0.8 },
  ];
  
  // Set dimensions for the chart
  const width = 800;
  const height = 400;
  const margin = { top: 40, right: 60, bottom: 60, left: 60 };
  
  // Create SVG container
  const svg = d3.select("#chart1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Scales
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, width]);
  
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => Math.max(d.divorceRate, d.fertilityRate))])
    .range([height, 0]);
  
  // Axes
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
  
  svg.append("g")
    .call(d3.axisLeft(yScale));
  
  // Line generators
  const lineDivorce = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.divorceRate))
    .curve(d3.curveMonotoneX);
  
  const lineFertility = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.fertilityRate))
    .curve(d3.curveMonotoneX);
  
  // Draw lines
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("d", lineDivorce);
  
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-width", 2)
    .attr("d", lineFertility);
  
  // Tooltip
  const tooltip = d3.select("#tooltip");
  
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.year))
    .attr("cy", d => yScale(d.divorceRate))
    .attr("r", 5)
    .attr("fill", "blue")
    .on("mouseover", (event, d) => {
      tooltip.style("display", "block")
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 20 + "px")
        .html(`Year: ${d.year}<br>Divorce Rate: ${d.divorceRate}`);
    })
    .on("mouseout", () => tooltip.style("display", "none"));
  
  svg.selectAll("circle.fertility")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.year))
    .attr("cy", d => yScale(d.fertilityRate))
    .attr("r", 5)
    .attr("fill", "green")
    .on("mouseover", (event, d) => {
      tooltip.style("display", "block")
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 20 + "px")
        .html(`Year: ${d.year}<br>Fertility Rate: ${d.fertilityRate}`);
    })
    .on("mouseout", () => tooltip.style("display", "none"));
  
  // Add chart title
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', -10)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('fill', 'white')
    .text('Divorce and Fertility Rates Trends');
  
  // Add axis labels
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + 40)
    .attr('text-anchor', 'middle')
    .style('fill', 'white')
    .text('Year');
  
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -40)
    .attr('text-anchor', 'middle')
    .style('fill', 'white')
    .text('Rate');
  
  // Add legend
  const legend = svg.append('g')
    .attr('transform', `translate(${width - 100}, 20)`);
  
  legend.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', 'blue');
  
  legend.append('text')
    .attr('x', 20)
    .attr('y', 12)
    .style('fill', 'white')
    .text('Divorce Rate');
  
  legend.append('rect')
    .attr('x', 0)
    .attr('y', 20)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', 'green');
  
  legend.append('text')
    .attr('x', 20)
    .attr('y', 32)
    .style('fill', 'white')
    .text('Fertility Rate');
  