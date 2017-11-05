

function createChart() {
  var gdpUrl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
  var yearData = [], monthData = [], gdpData = [];
  var margin = {top: 30, right: 30, bottom: 60, left: 60};
  var chartHeight = 550 - margin.top - margin.bottom;
  var chartWidth = 750 - margin.left - margin.right;

  // Asynchronous call to get data and build plot
  var gdpCall = d3.json(gdpUrl, function(error, gdp) {
    if (error) throw error;

    // Array format: [[1st day after qtr, value in US$ blns]]
    var source = gdp.source_name;
    var description = gdp.description;
    var rawGdp = gdp.data;
    for (var i = 0; i < rawGdp.length; i++) {
      var tempDate = rawGdp[i][0].split("-");
      var year = Number(tempDate[0]);
      var tempMonth = Number(tempDate[1]);
      var month;
      switch(tempMonth) {
        case 1:
          year--;
          month = "December";
          break;
        case 4:
          month = "March";
          break;
        case 7:
          month = "June";
          break;
        case 10:
          month = "September";
          break;
      }
      yearData.push(year);
      monthData.push(month);
      gdpData.push(rawGdp[i][1]);
    }
    // D3 setup
    var yScale = d3.scale.linear()
      .domain([0, d3.max(gdpData)])
      .range([0, chartHeight])

    var xScale = d3.scale.ordinal()
      .domain(d3.range(0, gdpData.length))
      .rangeBands([0, chartWidth])

    var tooltip = d3.select('body').append('div')
      .classed('tooltip', true)

    var gdpChart = d3.select('#chart')
      .append('svg')
        .attr('height', chartHeight + margin.top + margin.bottom)
        .attr('width', chartWidth + margin.left + margin.right)
        .append('g')
          .attr('transform', 'translate('+margin.left + ',' + margin.top + ')')
        .selectAll('rect').data(gdpData)
        .enter().append('rect')
          .classed('bar', true)
          .attr('width', xScale.rangeBand())
          .attr('height', 0)
          .attr('x', function(d, i) {
            return xScale(i);
          })
          .attr('y', chartHeight)
          .on('mouseover', function(d, i){
            var value = d.toFixed(1).toString().replace(/(\d)(?=\d{3}\.)/g, '$1,');
            var quarter = monthData[i];
            var year = yearData[i];
            var dataPoint = "<div class='text-center'><strong>US$"+ value +" Billion</strong><br />"+ quarter + " - " + year+"</div>";
            tooltip.transition()
              .style('opacity', .9)
            tooltip.html(dataPoint)
              .style('left', (d3.event.pageX - 35) + 'px')
              .style('top', (d3.event.pageY - 65) + 'px')
            d3.select(this).style('opacity', 0.5)
          })
          .on('mouseout', function(d) {
            tooltip.transition()
              .style('opacity', 0)
            d3.select(this).style('opacity', 1)
          })

    var vGuideScale = d3.scale.linear()
      .domain([0, d3.max(gdpData)])
      .range([chartHeight, 0])

    var vAxis = d3.svg.axis()
      .scale(vGuideScale)
      .orient('left')
      .ticks(10)

    var vGuide = d3.select('svg').append('g')
      vAxis(vGuide)
      vGuide.attr('transform', 'translate('+margin.left + ',' + margin.top + ')')
      vGuide.selectAll('path')
        .style({fill: 'none', stroke: '#333'})
      vGuide.selectAll('line')
        .style({stroke: '#333'})

    var hGuideScale = d3.scale.ordinal()
      .domain(d3.range(yearData[0], d3.max(yearData)+1))
      .rangeBands([0, chartWidth])

    var hAxis = d3.svg.axis()
      .scale(hGuideScale)
      .orient('bottom')
      .tickValues(hGuideScale.domain().filter(function(d, i) {
        return !(i % (hGuideScale.domain().length/7));
      }))

    var hGuide = d3.select('svg').append('g')
      hAxis(hGuide)
      hGuide.attr('transform', 'translate(' + margin.left + ', ' + (chartHeight + margin.top)+')')
      hGuide.selectAll('path')
        .style({fill: 'none', stroke: '#333'})
      hGuide.selectAll('line')
        .style({stroke: '#333'})

    var xTitle = d3.select('svg').append('text')
        .attr('x', (chartWidth + margin.left + margin.right)/2)
        .attr('y', chartHeight + margin.top + margin.bottom)
        .style('text-anchor', 'middle')
        .style('font-size', '16px')
        .text('Years')

      var footer = d3.select('.footer')
        .append('text')
        .text(source + ". " + description)


    gdpChart.transition()
      .attr('height', function(d) {
        return yScale(d);
      })
      .attr('y', function(d) {
        return chartHeight - yScale(d);
      })
      .delay(function(d, i){
        return i * 10;
      })
      .duration(500).ease('elastic')
  }
}


createChart();
