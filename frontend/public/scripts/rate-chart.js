const ctx = document.getElementById("toxicity-chart").getContext("2d");
// $('toxicity-chart').css({
//     "width": window.innerWidth
// })

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function formatDate(d) {
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
	return "   " + h + ":" + m + ":" + s;
}

const data = {
	"labels": [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ],
	"datasets": [
		{
			"label": "Reddit",
			"data": [],
			// "fill": 1,
			"borderColor": "rgb(29, 185, 85)",
			"backgroundColor": "rgba(29, 185, 85, 0.3)",
			"lineTension": 0.1
		},
		{
			"label": "Twitter",
			"data": [],
			// "fill": 'origin',
			"borderColor": "rgb(75, 192, 192)",
			"backgroundColor": "rgba(75, 192, 192, 0.3)",
			"lineTension": 0.1
		}
	],
	"options": {
		"plugins": {
			"filler": {
				"propagate": true
			}
		},
		"scales": {
			"yAxes": [{
				"stacked": true,
				"ticks": {
					"beginAtZero": true,
					"min": 0,
				}
			}]
		},
		"scaleStartValue": 0
	}
};
const liveLineChart = new Chart(ctx, {
	"type": "line",
	"data": data,
	"options": {
		steppedLine: false
	},
	maintainAspectRatio: false
});

var latestLabel = 0;
socket.on('rate', function(rate) {
	if (data.datasets[0].data.length > 20) {
		data.datasets[0].data.shift();
		data.datasets[1].data.shift();
	}
	data.datasets[1].data.push(rate['twitter']);
	data.datasets[0].data.push(rate['reddit']);

	if (latestLabel < 20) {
		data.labels[latestLabel] = formatDate(new Date());
	} else {
		data.labels.shift();
		data.labels.push(formatDate(new Date()));
	}

	liveLineChart.update();
	latestLabel++;
	// bar.animate(rate['total'] / maxRate);
});
