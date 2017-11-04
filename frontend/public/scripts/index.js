const socket = io("10.105.244.113:3000");

socket.on('words', function (words) {

	document.getElementById('words').innerHTML = words;

	let table = '';
	for (let i = 0; i < words.length; i++) {
		table += '<div class="ui segment"><p>' + words[i] + '</p></div>'
	}

	document.getElementById('trending-table').innerHTML = table
});

let bar;

function updateProgress(progress) {

}

$(document).ready(function () {
	const ctx = document.getElementById("toxicity-chart").getContext("2d");
	// $('toxicity-chart').css({
	//     "width": window.innerWidth
	// })

	const data = {
		"labels": ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
		"datasets": [
			{
				"data": [],
				"fill": false,
				"borderColor": "rgb(75, 192, 192)",
				"lineTension": 0.1
			}
		]
	};
	const liveLineChart = new Chart(ctx, {
		"type": "line",
		"data": data,
		"options": {
			steppedLine: false
		},
		// responsive: true
	});
	const latestLabel = 0;


	const bar = new ProgressBar.SemiCircle(document.getElementById('toxicity-moon'), {
		strokeWidth: 6,
		color: '#FFEA82',
		trailColor: '#eee',
		trailWidth: 1,
		easing: 'easeInOut',
		duration: 1400,
		svgStyle: null,
		text: {
			value: '',
			alignToBottom: false
		},
		from: {color: '#FFEA82'},
		to: {color: '#ED6A5A'},
		// Set default step function for all animate calls
		step: (state, bar) => {
			bar.path.setAttribute('stroke', state.color);
			const value = Math.round(bar.value() * 100);
			if (value === 0) {
				bar.setText('')
			} else {
				bar.setText(value)
			}

			bar.text.style.color = state.color
		}
	});

	socket.on('rate', function (rate) {
		if (data.datasets[0].data.length > 20) {
			data.datasets[0].data.shift()
			// data.labels.pop()
		}
		data.datasets[0].data.push(rate['rate']);
		// data.labels.push("")
		liveLineChart.update();
		bar.animate(1.0);

		console.log(rate)
	})
});