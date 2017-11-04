function createEventLine(summary, message) {
	const event = document.createElement("div");
	event.className = "event";

	const content = document.createElement("div");
	content.className = "content";
	event.appendChild(content);

	const sum = document.createElement("div");
	sum.className = "summary";
	sum.innerText = summary;
	content.appendChild(sum);

	const extraText = document.createElement("div");
	extraText.className = "extra text";
	content.appendChild(extraText);
	extraText.innerText = message;

	return event;
}

const feed = document.getElementById("high-speed-feed");

const $firstCol = $("#first-col");
const $feedCol = $("#feed-col");
function resizeFeed() {
	$feedCol.height($firstCol.height());
}
// window.addEventListener("resize", resizeFeed);
setTimeout(resizeFeed, 100);

socket.on("stream", function (data) {
	feed.insertBefore(createEventLine(data.poster + " on " + data.source, data.message), feed.firstChild);

	while (feed.children.length > 10) {
		feed.removeChild(feed.lastChild);
	}
	// console.log(data);
});