
const urlParams = new URLSearchParams(window.location.search)
const counts = !!urlParams.get("counts")

function makeStatistics(data) {
	let statistics = {}
	for (let d of data) {
		let arr = []
		if (d.Race.length > 0)
			arr.push(d.Race)
		if (d.Tags.length > 0)
			for (let t of d.Tags.split(","))
				arr.push(t.trim())
		d.tgs = arr.sort()

		for (let t of d.tgs) {
			if (typeof statistics[t] === "undefined")
				statistics[t] = 0
			statistics[t] += parseInt(d.Count)
		}
	}

	let statsArr = []
	for (let s of Object.keys(statistics))
		statsArr.push(s + ": " + statistics[s])
	d3.select("#statistics").text(statsArr.sort().join(", "))
}

function prepareCards(data) {
	d3.select("#cards").html(null);
	d3.select("#cards")
		.selectAll(".card")
		.data(data)
		.enter()
		.append("div")
		.classed("card", true)
		.attr("data-card-id", d => d.id);
}

loadCardsData(function (data) {
	makeStatistics(data);
	prepareCards(data);
	updateCards(data);
});
