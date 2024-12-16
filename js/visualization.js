((() => {
  d3.json("data/DoD_Budget.json", (data) => {
    var dispatchString = "selectionUpdated";

    // Create the table and heatmap instances
    let tableData = table()
    .selectionDispatcher(d3.dispatch(dispatchString))
    ("#table", data);

    let heatmapData = map()
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#map", data);

    tableData.selectionDispatcher().on(dispatchString, function (selectedData) {
      // Map table rows to state names and update the heatmap
      heatmapData.updateSelection(selectedData);   
  });
  
    heatmapData.selectionDispatcher().on(dispatchString, function (selectedData) {
      // Update the table based on state selection
      tableData.updateSelection(selectedData[0]);
  });
  });
}))();
