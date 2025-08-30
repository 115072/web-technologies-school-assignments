const dataArray = [];

function handleUpdate(event) {
  const eventData = JSON.parse(event.data);

  if (eventData.x && eventData.y1 && eventData.y2) {
    const idAndX = eventData.x;

    dataArray.push({
      id: idAndX,
      x: idAndX,
      y1: eventData.y1,
      y2: eventData.y2,
    });

    updatePlotlyGraph();
  } else {
    console.error(
      "Received message with missing or undefined properties:",
      eventData
    );
  }
}

function updatePlotlyGraph() {
  const xValues = dataArray.map((item) => item.x);

  var rangeSlider = document.getElementById("myRangeSlider");

  var currentValue = rangeSlider.inputTypeRange.value;

  const y1Values = dataArray.map((item) => currentValue * item.y1);
  const y2Values = dataArray.map((item) => currentValue * item.y2);

  var trace1 = {
    x: xValues,
    y: y1Values,
    type: "scatter",
    name: "sin",
    visible: document.getElementById("checkbox1").checked
      ? "legendonly"
      : "visible",
  };

  var trace2 = {
    x: xValues,
    y: y2Values,
    type: "scatter",
    name: "cos",
    visible: document.getElementById("checkbox2").checked
      ? "legendonly"
      : "visible",
  };

  var data = [trace1, trace2];

  Plotly.newPlot("myDiv", data);
}

function stopEventSource() {
  eventSource.close();
}

const eventSource = new EventSource(
  "https://old.iolab.sk/evaluation/sse/sse.php"
);

eventSource.addEventListener("message", handleUpdate);

document
  .getElementById("stopButton")
  .addEventListener("click", stopEventSource);

document
  .getElementById("checkbox1")
  .addEventListener("change", updatePlotlyGraph);
document
  .getElementById("checkbox2")
  .addEventListener("change", updatePlotlyGraph);

window.addEventListener("beforeunload", () => {
  eventSource.close();
});
