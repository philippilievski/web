//JSON
var LeistungWocheString = '{"Monday":30, "Tuesday":21, "Wednesday":50, "Thursday":14, "Friday":4, "Saturday":11, "Sunday":67 }';
var BlindleistungWocheString = '{"Monday":52, "Tuesday":52, "Wednesday":42, "Thursday":71, "Friday":19, "Saturday":67, "Sunday":70 }';

const LeistungWoche = JSON.parse(LeistungWocheString);
const BlindleistungWoche = JSON.parse(BlindleistungWocheString);

var xLeistung = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
var yLeistung = [LeistungWoche.Monday, LeistungWoche.Tuesday, LeistungWoche.Wednesday, LeistungWoche.Thursday, LeistungWoche.Friday, LeistungWoche.Saturday, LeistungWoche.Sunday];

var xBlindleistung = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
var yBlindleistung = [BlindleistungWoche.Monday, BlindleistungWoche.Tuesday, BlindleistungWoche.Wednesday, BlindleistungWoche.Thursday, BlindleistungWoche.Friday, BlindleistungWoche.Saturday, BlindleistungWoche.Sunday];


Plots = document.getElementById('LeistungenPlot');
var Leistung =
{
    x: xLeistung,
    y: yLeistung,
    type: 'bar',
    text: yLeistung.map(String),
    textposition: 'auto'
};


var Blindleistung =
{
        x: xBlindleistung,
        y: yBlindleistung,
        type: 'bar',
        text: yBlindleistung.map(String),
        textposition: 'auto'
};

var data1and2 = [Leistung, Blindleistung];
var layout = {barmode: 'group'};

Plotly.newPlot(Plots, data1and2, layout);