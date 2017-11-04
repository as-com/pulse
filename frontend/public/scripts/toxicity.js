const toxicityBar = new ProgressBar.SemiCircle(document.getElementById('toxicity-moon'), {
	strokeWidth: 6,
	color: '#FFEA82',
	trailColor: '#eee',
	trailWidth: 1,
	easing: 'linear',
	duration: 200,
	svgStyle: null,
	from: {color: '#FFEA82'},
	to: {color: '#ED6A5A'},
	// Set default step function for all animate calls
	step: (state, bar) => {
		bar.path.setAttribute('stroke', state.color);
		// bar.text.style.color = state.color
	}
});

const toxicityNum = document.getElementById("toxicity-num");
socket.on("toxicity", function (data) {
	toxicityBar.animate(data.toxicity);
	toxicityNum.innerText = (data.toxicity * 100).toFixed(1) + "%";
});