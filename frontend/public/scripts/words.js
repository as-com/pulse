const wordsApp = new Vue({
	el: "#words",
	data: {
		items: []
	},

});

socket.on("words", function (data) {
	// emojisApp.items.unshift(data[0]);
	wordsApp.items = data;
});
