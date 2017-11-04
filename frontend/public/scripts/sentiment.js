const sentimentBar = new ProgressBar.SemiCircle(document.getElementById('sentiment-moon'), {
	strokeWidth: 6,
	color: '#FFEB3B',
	trailColor: '#eee',
	trailWidth: 1,
	easing: 'linear',
	duration: 200,
	svgStyle: null,
	from: {color: '#FFEB3B'},
	to: {color: '#4CAF50'},
	// Set default step function for all animate calls
	step: (state, bar) => {
		bar.path.setAttribute('stroke', state.color);
		// bar.text.style.color = state.color
	}
});

const sentimentNum = document.getElementById("sentiment-num");
socket.on("sentiment", function (data) {
	sentimentBar.animate(data['average']);
	sentimentNum.innerText = (data['average'] * 100).toFixed(1) + "%";
});