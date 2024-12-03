function table() {
    let dispatcher;

    function chart(selector, data) {
        // Create table structure
        let table = d3.select(selector)
            .append("table")
            .classed("my-table", true);

        let tableHeaders = Object.keys(data[0]);

        // Append table headers
        let tr = table.append('thead').append('tr');
        tr.selectAll('th')
            .data(tableHeaders)
            .enter()
            .append('th')
            .text(d => d);

        // Append table rows and cells
        let tbody = table.append("tbody");
        let rows = tbody.selectAll("tr")
            .data(data)
            .enter()
            .append("tr");

        rows.selectAll("td")
            .data(d => Object.values(d))
            .enter()
            .append("td")
            .text(d => d);

        // Tooltip logic
        let tooltip = d3.select("#tooltip");

        rows.on("mouseover", function (event, d) {
            tooltip.html(`
                <strong>State:</strong> ${d.State}<br>
                <strong>DoD Budget RAW:</strong> ${d["DoD Budget RAW"]}
            `)
            .style("visibility", "visible");
        })
        .on("mousemove", function (event) {
            tooltip.style("top", (event.pageY + 10) + "px")
                   .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
        });

        // Brushing and linking logic
        let isMouseDown = false;

        rows.on("mousedown", function (event, d) {
            // Clear all selections
			console.log("Selected data:", d3.selectAll(".selected").data());

            d3.selectAll("tr").classed("selected", false);

            // Mark the clicked row as selected
            d3.select(this).classed("selected", true);

            // Dispatch the selection
            let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
            dispatcher.call(dispatchString, this, d3.selectAll(".selected").data());

            isMouseDown = true;
        })
        .on("mouseup", function () {
            isMouseDown = false;
        })
        .on("mouseover", function (event, d) {
            if (isMouseDown) {
                // Add selected class during mouseover when dragging
                d3.select(this).classed("selected", true);

                // Dispatch the updated selection
                let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
                dispatcher.call(dispatchString, this, d3.selectAll(".selected").data());
            }
        });

        return chart;
    }

    chart.selectionDispatcher = function (_) {
        if (!arguments.length) return dispatcher;
        dispatcher = _;
        return chart;
    };

    chart.updateSelection = function (selectedData) {
        if (!arguments.length) return;

        // Update selection
        d3.selectAll('tr').classed("selected", d => selectedData.includes(d));
    };

    return chart;
}
