// Read JSON data
const mainData = 'samples.json'

// START Dropdown code 
const selections = d3.selectAll('#selDataset')
d3.json(mainData).then((data) => {
  const subjectID = data.names;
  // console.log(subjectID)
  Object.entries(subjectID).forEach(([i, element]) => {
    selections.append('option')
      .text(element)

  });
})
// END Dropdown code


// START METADATA function
function metaInfo(testID) {
  d3.json(mainData).then(data => {
    const metaData = data.metadata;
    const sampleID = metaData.filter(element => element.id == testID)[0];
    // console.log(sampleID);
    const sampleMeta = d3.select('#sample-metadata');
    sampleMeta.html('');
    Object.entries(sampleID).forEach(([k, v]) => {
      sampleMeta.append("p").text(`${k}: ${v}`);
    });
  })

};
// END METADATA function

// START CHART function 
function buildPlots(testID) {
  d3.json(mainData).then(data => {
    const names = data.names;
    // console.log(names)
    const sampleData = data.samples;
    //filter variables to selected subject
    const selectSubject = sampleData.filter(element => element.id == testID);
    const subjectID = selectSubject[0].id;
    const sampleValue = selectSubject[0].sample_values;
    const sampleOtuId = selectSubject[0].otu_ids;
    const sampleOtuLabel = selectSubject[0].otu_labels;
 
    //""""Extract matching labels and values for selected subject
    const subjectValues = sampleValue.map((element, i) => {
      let otuValues = sampleValue[i];
      return element;
    })
    const subjectLabel = sampleOtuLabel.map((element, i) => {
      let otuID = sampleOtuId[i];
      return (`${otuID}: ${element.split(";").slice(-1)[0]}`);
    })
    const subjectLabel1 = sampleOtuLabel.map((element, i) => {
      let otuID = sampleOtuId[i];
      return (`${element.split(";").slice(-1)[0]}`);
    })
    // set variables for chart axis 
    const chartXbar1 = subjectValues.slice(0, 10).reverse();
    const chartYbar1 = subjectLabel.slice(0, 10);
    // const chartXbar2 = subjectValues;
    // const chartYbar2 = subjectLabel;
    const bubbleXaxis = subjectValues;
    const bubbleYaxis = sampleOtuLabel;
    // const bubbleSize =(bubbleXaxis/5);

    //barplot1 - selected subject 
    const title = `Top 10 Bacteria - Selected Subject`;
    const trace = {
      x: chartXbar1,
      y: chartYbar1,
      type: 'bar',
      orientation: 'h',
      title: title,
      text: subjectLabel.reverse()
    };
    var data = [trace];
    var layout = {
      title: title,
      xaxis: { title: "Values" },
      yaxis: subjectLabel,
      width: 600,
      margin: {
        l: 250,
        r: 50,
        b: 100,
        t: 100,
        pad: 10
      }
    };
    Plotly.newPlot("bar1", data, layout);

      //bar plot 2 - Top 10 Bacteria all subjects 


    //buble chart 
    const title3 = `Count of Bacteria by Family - Selected Subject`;
    const trace3 = {
      x: bubbleXaxis,
      y: bubbleYaxis,
      mode: 'markers',
      marker: {
        size: subjectValues,
        color: sampleOtuId,
        text: sampleOtuLabel,
        sizeref: 1,
        sizemode: 'area',
      }
    };
    var data3 = [{
      type: 'bubble',
      x: bubbleXaxis,
      y: bubbleYaxis,
      mode: 'markers',
      marker: {
        size: subjectValues,
        text: sampleOtuLabel,
        sizeref: 1,
        sizemode: 'area',
      },
      transforms: [{
        type: 'aggregate',
        groups: bubbleYaxis,
        aggregations: [
          { target: 'x', func: 'sum', enabled: true },]
      }]

    }]
    var layoutBubble = {
      title: title3,
      yaxis: bubbleYaxis,
      width: 1100,
      autochange: true,
      margin: {
        l: 580,
        r: 0,
        b: 70,
        t: 70,
        pad: 10
      }

    };
    Plotly.newPlot("bubble", data3, layoutBubble);
  })
};

//Get a handle on the option change handler
d3.select('#dataset').on("change", optionChanged);

//START option change function
function optionChanged(testID) {
  metaInfo(testID)
  buildPlots(testID)
}
//END Optionn changed function 

//START page initialization function to specfic test subject ID at index 0, id 940
function init() {
  d3.json(mainData).then(data => {
  const names = data.names;
  const defaultID = data.names[0];
  metaInfo(defaultID);
  buildPlots(defaultID);
})
}
//END page initialization option



//Initialize page
init()




