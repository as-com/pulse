const hashtagsApp = new Vue({
	el: "#hashtags",
	data: {
		items: []
	},

});

socket.on("hashtags", function (data) {
	// emojisApp.items.unshift(data[0]);
	hashtagsApp.items = data;
});
