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

const mentionsApp = new Vue({
	el: "#mentions",
	data: {
		items: []
	},

});

socket.on("mentions", function (data) {
	// emojisApp.items.unshift(data[0]);
	mentionsApp.items = data;
});
