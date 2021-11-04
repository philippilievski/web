var data = [
    {
      x: ['Workshop', 'APOO-AT', 'TF-TE', 'IT-Technik', 'AU_SE', 'TR-Runtime', 'TR-Communication'],
      y: [1, 1.75, 1, 1.75, 4.5, 6, 15],
      marker:{
        color: '#06D6A0'
      },
      type: 'bar'
    }
  ];

var layout = {
    plot_bgcolor: "#152D35",
    paper_bgcolor: "#152D35",
    font: {
        family: 'Courier New, monospace',
        size: 18,
        color: "#D4ECDD"
      }
}
  
  Plotly.newPlot('abteilungenplot', data, layout);