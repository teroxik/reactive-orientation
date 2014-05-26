    App.TestController = Ember.ArrayController.extend({
      content:  DATA
    });

    var color = ["#3b5998", "#FF0000", "#00FF00", "#FFFF00", "#66CCFF", "#FF00FF", "#C0C0C0"];

    App.DonutChartComponent = Ember.Component.extend({
      tagName: 'svg',

      didInsertElement: function(){
        var width = this.get('width');
        var height = this.get('height');
        var radius = Math.min(width, height) / 2;

        var arc = d3.svg.arc()
          .outerRadius(radius)
          .innerRadius(radius-30);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.population; });

        var id = this.$().attr('id');
        var svg = d3.select("#"+id)
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var g = svg.selectAll(".arc")
          .data(pie(DATA))
        .enter().append("g")
          .attr("class", "arc");

        g.append("path")
          .attr("d", arc)
          .style("fill", function(d, i) { return color[i]; });
      }
    });


    var DATA = [
      {age: '<5', population: 2704659},
      {age: '5-13', population: 4499890},
      {age: '14-17', population: 2159981},
      {age: '18-24', population: 3853788},
      {age: '25-44', population: 14106543},
      {age: '45-64', population: 8819342},
      {age: '≥65', population: 612463}
    ];
