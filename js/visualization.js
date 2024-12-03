// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {

  // Load the data from a JSON file
  d3.json("data/DoD_Budget.json", (data) => {

    // General event type for selections, used by d3-dispatch
    // https://github.com/d3/d3-dispatch
    const dispatchString = "selectionUpdated";

    // Create a tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "#f4f4f4")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("border-radius", "5px");

    // Create a table with a dispatcher
    let tableData = table()
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#table", data);

    // Add tooltip behavior
    d3.selectAll("tr")
      .on("mouseover", function (event, d) {
        if (d) { // Ensure `d` exists to avoid tooltips on empty rows
          tooltip.style("visibility", "visible")
            .text(`State: ${d.State}, Budget: ${d["DoD Budget RAW"]}`);
        }
      })
      .on("mousemove", function (event) {
        tooltip.style("top", (event.pageY + 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
      });

    // Handle table updates via brushing
    tableData.selectionDispatcher().on(dispatchString, function (selectedData) {
      console.log("Dispatched data:", selectedData);
      // Update linked visualizations here
      // spUnemployMurder.updateSelection(selectedData);
      // lcYearPoverty.updateSelection(selectedData);
    });
  });

})());
