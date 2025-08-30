function loadXMLDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      myFunction(this);
    }
  };
  xhttp.open("GET", "z03.xml", true);
  xhttp.send();
}
var rokArray = [];
var hodnotenieArray = [];
var hodnotenieTagNamesArray = [];

function myFunction(xml) {
  var x, i, xmlDoc, txt;
  xmlDoc = xml.responseXML;
  x = xmlDoc.getElementsByTagName("zaznam");

  for (i = 0; i < x.length; i++) {
    var rokElement = x[i].getElementsByTagName("rok")[0];
    var rokValue = rokElement.childNodes[0].nodeValue;
    rokArray.push(rokValue);

    var hodnotenieElement = x[i].getElementsByTagName("hodnotenie")[0];
    var hodnotenieValues = Array.from(hodnotenieElement.children).map((child) =>
      parseInt(child.textContent, 10)
    );

    hodnotenieArray.push(hodnotenieValues);
  }

  var hodnotenieChildren;
  var hodnotenieElement = xmlDoc.querySelector("zaznam hodnotenie");

  if (hodnotenieElement) {
    hodnotenieChildren = hodnotenieElement.children;

    for (var j = 0; j < hodnotenieChildren.length; j++) {
      var tagName = hodnotenieChildren[j].tagName;

      if (!hodnotenieTagNamesArray.includes(tagName)) {
        hodnotenieTagNamesArray.push(tagName);
      }
    }
  }

  function transposeArray(array) {
    return array[0].map((_, colIndex) => array.map((row) => row[colIndex]));
  }

  hodnotenieArray = transposeArray(hodnotenieArray);

  var traces = [];

  for (var k = 0; k < hodnotenieTagNamesArray.length; k++) {
    var trace = {
      x: window.innerWidth < 280 ? hodnotenieArray[k] : rokArray,
      y: window.innerWidth < 280 ? rokArray : hodnotenieArray[k],
      type: "bar",
      orientation: window.innerWidth < 280 ? "h" : "v",
      name: hodnotenieTagNamesArray[k],
    };

    traces.push(trace);
  }

  var layout = {
    title: "Znamky",
    showlegend: true,
  };

  Plotly.newPlot("myDiv", traces, layout, { displayModeBar: false });

  hodnotenieArray = transposeArray(hodnotenieArray);

  for (var i = 0; i < 6; i++) {
    var data = [
      {
        type: "pie",
        values: hodnotenieArray[i],
        labels: hodnotenieTagNamesArray,
        textinfo: "label+percent",
        textposition: "inside",
        automargin: true,
      },
    ];

    var layout = {
      height: 300,
      width: 300,
      margin: { t: 30, b: 30, l: 30, r: 30 },
      showlegend: false,
      title: rokArray[i],
    };

    var config = { responsive: true };

    Plotly.newPlot("zs" + (i + 16), data, layout, config);
  }

  hodnotenieArray = transposeArray(hodnotenieArray);

  var data1 = [];

  for (
    let i = 0;
    i < Math.min(hodnotenieArray.length, hodnotenieTagNamesArray.length);
    i++
  ) {
    var trace = {
      x: rokArray,
      y: hodnotenieArray[i],
      type: "scatter",
      name: hodnotenieTagNamesArray[i],
    };
    data1.push(trace);
  }

  Plotly.newPlot("linePlot", data1);
}

loadXMLDoc();

console.log(rokArray);
console.log(hodnotenieArray);
console.log(hodnotenieTagNamesArray);
