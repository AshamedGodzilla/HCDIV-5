Promise.all([
    d3.json('singapore_gdp.json'),
    d3.json('singapore_marriage.json'),
    d3.json('singapore_population.json')
]).then(([gdpData, marriageData, populationData]) => {
    const years = gdpData.singapore_gdp_data.data.annual
        .filter(d => parseInt(d.year) >= 2000)
        .map(d => d.year);

    const marriageGDPData = years.map(year => {
        const gdpEntry = gdpData.singapore_gdp_data.data.annual.find(d => d.year === year);
        const marriageEntry = marriageData.singapore_marriage_data.annual_data.find(d => d.year === year);
        return {
            year: parseInt(year),
            gdp: gdpEntry ? gdpEntry.gdp_current_market_prices : null,
            rate: marriageEntry ? (marriageEntry.total_population.married / marriageEntry.total_population.total * 100) : null
        };
    }).filter(d => d.gdp !== null && d.rate !== null);

    const birthGDPData = years.map(year => {
        const gdpEntry = gdpData.singapore_gdp_data.data.annual.find(d => d.year === year);
        const popEntry = populationData.singapore_population_data.annual_data.find(d => d.year === year);
        return {
            year: parseInt(year),
            gdp: gdpEntry ? gdpEntry.gdp_current_market_prices : null,
            rate: popEntry ? popEntry.total_population.growth : null
        };
    }).filter(d => d.gdp !== null && d.rate !== null);

    const migrationGDPData = years.map(year => {
        const gdpEntry = gdpData.singapore_gdp_data.data.annual.find(d => d.year === year);
        const popEntry = populationData.singapore_population_data.annual_data.find(d => d.year === year);
        return {
            year: parseInt(year),
            gdp: gdpEntry ? gdpEntry.gdp_current_market_prices : null,
            rate: popEntry ? (popEntry.non_resident_population.number / popEntry.total_population.number * 100) : null
        };
    }).filter(d => d.gdp !== null && d.rate !== null);

    const chartConfigs = {
        marriage: {
            title: 'Marriage Rate vs GDP (2000-2023)',
            yLeftLabel: 'Married Population Ratio (%)',
            yRightLabel: 'GDP (Million SGD)',
            colors: {
                rate: '#FF6B6B',
                gdp: '#4ECDC4'
            },
            yAxisFormat: value => value.toFixed(1) + '%',
            tooltipFormat: value => value.toFixed(2) + '%'
        },
        birth: {
            title: 'Population Growth Rate vs GDP (2000-2023)',
            yLeftLabel: 'Growth Rate (%)',
            yRightLabel: 'GDP (Million SGD)',
            colors: {
                rate: '#FFB900',
                gdp: '#4ECDC4'
            },
            yAxisFormat: value => value.toFixed(1) + '%',
            tooltipFormat: value => value.toFixed(2) + '%'
        },
        migration: {
            title: 'Non-Resident Population Ratio vs GDP (2000-2023)',
            yLeftLabel: 'Population Ratio (%)',
            yRightLabel: 'GDP (Million SGD)',
            colors: {
                rate: '#A78BFA',
                gdp: '#4ECDC4'
            },
            yAxisFormat: value => value.toFixed(1) + '%',
            tooltipFormat: value => value.toFixed(2) + '%'
        }
    };

    createChart('#chart1', marriageGDPData, chartConfigs.marriage);
    createChart('#chart2', birthGDPData, chartConfigs.birth);
    createChart('#chart3', migrationGDPData, chartConfigs.migration);
});

function createChart(selector, data, config) {
    d3.select(selector).html('');

    const margin = {top: 70, right: 90, bottom: 70, left: 90};
    const width = 900 - margin.left - margin.right;
    const height = 550 - margin.top - margin.bottom;

    const svg = d3.select(selector)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width]);

    const y1 = d3.scaleLinear()
        .domain([
            Math.min(0, d3.min(data, d => d.rate) * 1.2),
            Math.max(0, d3.max(data, d => d.rate) * 1.2)
        ])
        .range([height, 0]);

    const y2 = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.gdp) * 1.2])
        .range([height, 0]);

    if (y1.domain()[0] < 0 && y1.domain()[1] > 0) {
        svg.append('line')
            .attr('class', 'zero-line')
            .attr('x1', 0)
            .attr('x2', width)
            .attr('y1', y1(0))
            .attr('y2', y1(0))
            .style('stroke', '#999')
            .style('stroke-dasharray', '4,4')
            .style('stroke-width', 1);
    }

    const rateLine = d3.line()
        .x(d => x(d.year))
        .y(d => y1(d.rate))
        .curve(d3.curveMonotoneX);

    const gdpLine = d3.line()
        .x(d => x(d.year))
        .y(d => y2(d.gdp))
        .curve(d3.curveMonotoneX);

    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format('d')));

    svg.append('g')
        .call(d3.axisLeft(y1)
            .tickFormat(config.yAxisFormat || (d => d.toFixed(1))));

    svg.append('g')
        .attr('transform', `translate(${width},0)`)
        .call(d3.axisRight(y2));

    svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .style('stroke', (d, i) => i === 0 ? config.colors?.rate : config.colors?.gdp)
        .attr('d', rateLine);

    svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .style('stroke', (d, i) => i === 0 ? config.colors?.rate : config.colors?.gdp)
        .attr('d', gdpLine);

    svg.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', -60)
        .attr('x', -height/2)
        .style('text-anchor', 'middle')
        .text(config.yLeftLabel);

    svg.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(90)')
        .attr('y', -width - 60)
        .attr('x', height/2)
        .style('text-anchor', 'middle')
        .text(config.yRightLabel);

    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width-150},-30)`);

    legend.append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 0)
        .attr('y2', 0)
        .style('stroke', config.colors?.rate || '#ff6b6b');

    legend.append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 20)
        .attr('y2', 20)
        .style('stroke', config.colors?.gdp || '#4ecdc4');

    legend.append('text')
        .attr('x', 25)
        .attr('y', 5)
        .text(config.title);

    legend.append('text')
        .attr('x', 25)
        .attr('y', 25)
        .text('GDP');

    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    svg.selectAll('.dot-rate')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot-rate')
        .attr('cx', d => x(d.year))
        .attr('cy', d => y1(d.rate))
        .attr('r', 6)
        .style('fill', config.colors?.rate)
        .style("cursor", "pointer")
        .on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', 8);
            
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            
            tooltip.html(
                `<strong>Year: ${d.year}</strong><br/>` +
                `${config.yLeftLabel}: ${config.tooltipFormat(d.rate)}<br/>` +
                `GDP: ${d.gdp.toLocaleString()} M`
            )
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', 6);
            
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });

    svg.selectAll('.dot-gdp')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot-gdp')
        .attr('cx', d => x(d.year))
        .attr('cy', d => y2(d.gdp))
        .attr('r', 6)
        .style('fill', config.colors?.gdp)
        .style("cursor", "pointer")
        .on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', 8);
            
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            
            tooltip.html(
                `<strong>Year: ${d.year}</strong><br/>` +
                `${config.yLeftLabel}: ${config.tooltipFormat(d.rate)}<br/>` +
                `GDP: ${d.gdp.toLocaleString()} M`
            )
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', 6);
            
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });

    const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "area-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", config.colors.rate)
        .attr("stop-opacity", 0.3);

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", config.colors.rate)
        .attr("stop-opacity", 0);

    const area = d3.area()
        .x(d => x(d.year))
        .y0(height)
        .y1(d => y1(d.rate))
        .curve(d3.curveMonotoneX);

    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
        .style("fill", "url(#area-gradient)");

    svg.selectAll(".domain")
        .style("stroke", "#ccc")
        .style("stroke-width", 1);

    svg.selectAll(".tick line")
        .style("stroke", "#eee")
        .style("stroke-width", 1);

    svg.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x)
            .tickSize(-height)
            .tickFormat("")
        )
        .style("stroke", "#eee")
        .style("stroke-width", 0.5);

    svg.append('text')
        .attr('class', 'chart-title')
        .attr('x', width / 2)
        .attr('y', -margin.top / 2 - 20)
        .attr('text-anchor', 'middle')
        .style('font-size', '20px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .text(config.title);

    const style = document.createElement('style');
    style.textContent = `
        .line {
            stroke-width: 3;
            fill: none;
            stroke-linejoin: round;
            stroke-linecap: round;
        }
        .area {
            opacity: 0.2;
        }
        .dot-rate, .dot-gdp {
            transition: all 0.3s ease;
            stroke-width: 1.5;
            stroke: white;
            cursor: pointer;
        }
        .dot-rate:hover, .dot-gdp:hover {
            r: 7;
            stroke-width: 2.5;
            filter: brightness(110%);
        }
        .tooltip {
            background: rgba(0, 0, 0, 0.85);
            color: white;
            border-radius: 6px;
            padding: 12px 15px;
            font-size: 13px;
            font-weight: 500;
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
            pointer-events: none;
        }
        .axis-label {
            font-size: 13px;
            font-weight: 500;
            fill: #555;
        }
        .legend {
            font-size: 13px;
            font-weight: 500;
            fill: #555;
        }
        .grid line {
            stroke: #eee;
            stroke-opacity: 0.8;
        }
        .grid path {
            stroke-width: 0;
        }
        .tick text {
            font-size: 12px;
            fill: #666;
        }
        .domain {
            stroke: #ccc;
            stroke-width: 1.5;
        }
        .chart-container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            padding: 25px;
            margin: 30px auto;
        }
    `;
    document.head.appendChild(style);
}
  