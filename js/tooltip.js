// Assuming your table rows have a class "state-row" and each has a data attribute "data-state"
const stateImages = {
    "Utah": "images/Utah.png",
    "Virginia": "images/Virginia.png",
    "Rhode Island": "images/Rhode Island.png"
    
};

// Select all table rows
d3.selectAll(".state-row")
    .on("click", function (event, d) {
        const stateName = d3.select(this).attr("data-state"); // Get the state name
        const imageUrl = stateImages[stateName]; // Lookup the image URL

        // Update tooltip content
        d3.select("#tooltip-img").attr("src", imageUrl);
        d3.select("#tooltip-text").text(`Additional information for ${stateName}`);

        // Show and position tooltip
        d3.select("#tooltip")
            .style("visibility", "visible")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY + 10}px`);
    });

// Hide the tooltip when clicking outside
d3.select("body").on("click", function (event) {
    if (!event.target.closest(".state-row")) {
        d3.select("#tooltip").style("visibility", "hidden");
    }
});
