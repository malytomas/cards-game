
const printing = !!(new URLSearchParams(window.location.search)).get("print");

function makeStatistics(data) {
	let statistics = {};
	statistics["total"] = 0;
	for (let d of data) {
		let arr = [];
		if (d.Race.length > 0)
			arr.push(d.Race);
		if (d.Tags.length > 0)
			for (let t of d.Tags.split(","))
				arr.push(t.trim());
		d.tgs = arr.sort();

		for (let t of d.tgs) {
			if (typeof statistics[t] === "undefined")
				statistics[t] = 0;
			statistics[t] += parseInt(d.Count);
		}
		statistics["total"] += parseInt(d.Count);
	}

	let statsArr = [];
	for (let s of Object.keys(statistics))
		statsArr.push(s + ": " + statistics[s]);
	d3.select("#statistics").text(statsArr.sort().join(", "));
}

function prepareCards(data) {
	d3.select("#cards").html(null);
	for (let d of data) {
		let cnt = printing ? d.Count : 1;
		for (let i = 0; i < cnt; i++) {
			d3.select("#cards")
				.data([d])
				.append("div")
				.classed("card", true)
				.classed("showcardscount", !printing)
				.attr("data-card-id", d => d.id);
		}
	}
}

loadCardsData(function (data) {
	makeStatistics(data);
	prepareCards(data);
	updateCards(data);
});
