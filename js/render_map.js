function map() {
    let ourBrush = null,
    dispatcher;

    // Create the chart by appending an SVG to the selector and rendering the heatmap
    function chart(selector) {
        // Set up dimensions and projection
        var width = window.innerWidth;
        var height = window.innerHeight;

        var projection = d3.geoAlbersUsa().translate([width / 2, height / 2]);
        var path = d3.geoPath().projection(projection);

        // Create the SVG container
        var svg = d3.select(selector).append("svg")
            .attr("width", width)
            .attr("height", height);

        var svgBoundary = svg.append("g").attr("id", "boundary");
        var svgStates = svg.append("g").attr("id", "states");

        var useStateColors = true; // Toggle variable for color modes

        // Load and render boundary
        d3.json("data/usa.json", function(error, boundary) {
            svgBoundary.selectAll("path")
                .data(boundary.features)
                .enter()
                .append("path")
                .attr("d", path)
        });


        let isMouseDown = false;

        let selectedStates = new Set();

        // Load and render states
        var svgStates = svg.append("g").attr("id", "states");

        d3.json("data/states.json", function(error, topologies) {
            var state = topojson.feature(topologies[12], topologies[12].objects.stdin);
            var statepaths = svgStates.selectAll("path")
                .data(state.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", function (d) {
                    var name = d.properties.STATENAM.replace("", "");
                    return colors_state[name];
                })
                .on("mouseover", (event, d) => handleMouseOver(event, d, path, state))
                .on("mouseout", handleMouseOut)
                .on("click", handleStateClick);
            
                statepaths.append("title").text(d => d.properties.STATENAM);

            // Add event listener for table row selection
            d3.selectAll("table tr").on("click", function() {
                var stateName = d3.select(this).select("td").text().replace("", "");
                highlightState(stateName);
            });
            
        });


        function handleStateClick(event, d) {
            var stateName = d3.select(this).select("title").text().replace("", ""); // Access the title tag
            highlightState(stateName);
        }

        
        function highlightState(stateName) {
            svgStates.selectAll("path")
                .style("fill", function(d) {
                    var currentColor = useStateColors ? colors_state[d.properties.STATENAM.replace("", "")] : colors_total[d.properties.STATENAM.replace("", "")];
                    return d.properties.STATENAM.replace("", "") === stateName ? (useStateColors ? "#0000FF" : "blue") : currentColor;
                });
            let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
            dispatcher.call(dispatchString, this, [stateName]);
        }

        // Event handlers for mouse interactions
        function handleMouseOver(event, d, path, state) {
            var name = state.features[d].properties.STATENAM.replace("", "");
            var centroid = path.centroid(d);
    
            
            // handleMouseClick(event, d, state, name);
            d3.select("#popup")
                .style("display", "block")
                .style("left", `${centroid[0]}px`)
                .style("top", `${centroid[1] - 60}px`)
                .style("transform", "scale(1.5)") // Enlarge size
                .style("z-index", 2000) // Bring to front
                .html(`
                    <strong>${name}</strong><br>
                    <img src="images/${name}.png" alt="${name}" style="max-width: 200px; display: block; margin: 10px 0;">
                `);
            
           
        }
        

        // Update map colors dynamically
        function updateMapColors() {
            svgStates.selectAll("path")
                .transition()
                .duration(500)
                .style("fill", d => {
                    var name = d.properties.STATENAM.replace("", "");
                    return useStateColors ? colors_state[name] : colors_total[name];
                });
        }

        // Button to toggle color states
        d3.select("#toggleColors").on("click", () => {
            useStateColors = !useStateColors;
            updateMapColors();
        });

       
        function handleMouseOut() {
            d3.select("#popup").style("display", "none");
        }

        return chart;
    }

    // Gets or sets the dispatcher for selection events
    chart.selectionDispatcher = function (_) {
        if (!arguments.length) return dispatcher;
        dispatcher = _;
        return chart;
    };

    // Links selected data to the map (if integrating with other components)
    chart.updateSelection = function (selectedData) {
        if (!arguments.length) return;        
    };

    return chart;
}
