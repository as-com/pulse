const maxRate = 300;

// socket.on('words', function(words) {
//
//     document.getElementById('words').innerHTML = words;
//
// 	let table = '';
// 	for (let i = 0; i < words.length; i++) {
//         table += '<div class="ui segment"><p>' + words[i] + '</p></div>'
//     }
//
//     document.getElementById('trending-table').innerHTML = table
// });

function updateProgress(progress) {

}




const bar = new ProgressBar.SemiCircle(document.getElementById('toxicity-moon'), {
	strokeWidth: 6,
	color: '#FFEA82',
	trailColor: '#eee',
	trailWidth: 1,
	easing: 'easeInOut',
	duration: 200,
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
		const value = Math.round(bar.value() * maxRate);
		if (value === 0) {
			bar.setText('')
		} else {
			bar.setText(value)
		}

		bar.text.style.color = state.color
	}
});
