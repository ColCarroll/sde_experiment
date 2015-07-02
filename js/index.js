var spacing = 32,
    speed = 100,
    graphic = {},
    normal = d3.random.normal();

graphic.create = function() {
    var elt = $('#graphic');
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = elt.width() - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var x = d3.scale.linear().range([0, width]),
        y = d3.scale.linear().range([height, 0]),
        xMap = function(d){return d.x;},
        yMap = function(d){return d.y;},
        xVal = function(d){return x(xMap(d));},
        yVal = function(d){return y(yMap(d));};

    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format("$,.2r"));

    var line = d3.svg.line()
        .x(xVal)
        .y(yVal);

    var g = d3.select("#graphic")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    g.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price");

    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width - 5);

    var path = g.append("g")
        .append("path")
        .attr("class", "line");

    function update(data){
        var yMax = d3.max(data, yMap);
        x.domain(d3.extent(data, xMap));
        y.domain([0, d3.max(data, yMap)]);

        path
            .datum(data)
            .transition()
            .duration(speed)
            .attr("class", "line")
            .attr("d", line);
        g.selectAll("g.x.axis")
            .call(xAxis);
        g.selectAll("g.y.axis")
            .call(yAxis);
    }

    return update;
};

updateData = function(mu, sigma, dt, data){
    console.log(mu);
    var lastPrice = data[data.length - 1],
        dW = Math.sqrt(dt) * (normal() - normal());
    data.push({x: lastPrice.x + dt, y: lastPrice.y + (mu * dt + sigma * dW) * lastPrice.y});
};

run = function(){
    var mu = $("#mu").val(),
        sigma = $("#sigma").val(),
        dt = 0.1;

    var lineData = [{x: 0, y: 1}];
    updateData(mu, sigma, dt, lineData);

    var updateGraph = graphic.create();
    updateGraph(lineData);

    (function loop() {
        var mu = $("#mu").val(),
            sigma = $("#sigma").val();
        setTimeout(function () {
            updateData(mu, sigma, dt, lineData);
            updateGraph(lineData);
            loop();
        }, speed);
    }());
};

addLabel = function(label, input){
    label.text(input.val());
    input.on('input', function(){
        label.text($(this).val());
    });
};

$(document).ready(function() {
    addLabel($('#muLabel'), $('#mu'));
    addLabel($('#sigmaLabel'), $('#sigma'));
    return run();
});
