const emojisApp = new Vue({
	el: "#emojis",
	data: {
		items: []
	},

});

socket.on("emoji", function (data) {
	// emojisApp.items.unshift(data[0]);
	emojisApp.items = data.slice(0, 12);
});
