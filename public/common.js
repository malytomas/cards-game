
function makeClasses(d) {
	let arr = []
	for (let t of d.tgs)
		arr.push("tag-" + t)
	arr.push("card")
	return arr.join(" ")
}

function makeImgSrc(d) {
	return "images/" + d.id + ".png"
}

function makeTags(d) {
	return d.tgs.join(", ")
}

function makeStats(d) {
	let arr = []
	if (d.Culture.length > 0)
		arr.push(d.Culture + "<img src=\"media/culture.png\">")
	if (d.Military.length > 0)
		arr.push(d.Military + "<img src=\"media/military.png\">")
	if (d.Faith.length > 0)
		arr.push(d.Faith + "<img src=\"media/faith.png\">")
	return "&nbsp;" + arr.join(" &nbsp; ") + "&nbsp;"
}

function makeDescription(d) {
	let arr = []
	for (let a of d.Description.split(";")) {
		arr.push(a.trim()
			.replace(/^'/, "")
			.replace("\"", "<q>")
			.replace("\"", "</q>")
			.replace(/\\C/g, "<img src=\"media/culture.png\">")
			.replace(/\\M/g, "<img src=\"media/military.png\">")
			.replace(/\\F/g, "<img src=\"media/faith.png\">")
		)
	}
	return arr.join("<br>")
}

function findCard(data, id) {
	for (let d of data) {
		if (d.id == id)
			return [d];
	}
}

function updateCards(data) {
	d3.selectAll(".card").each(function() {
		let sel = d3.select(this);
		sel.data(findCard(data, sel.attr("data-card-id")));
		sel.attr("class", makeClasses);
		let cont = 	sel.append("div").classed("container", true);

		cont
			.append("div")
			.classed("name", true)
			.text(d => d.Name)

		cont
			.append("div")
			.classed("picture", true)
			.append("img")
			.attr("src", makeImgSrc)
			.attr("alt", makeImgSrc)

		cont
			.append("div")
			.classed("tags", true)
			.html(makeTags)

		cont
			.append("div")
			.classed("stats", true)
			.html(makeStats)

		cont
			.append("div")
			.classed("description", true)
			.html(makeDescription)

		let footer = cont
			.append("div")
			.classed("footer", true)

		footer.
			append("span")
			.classed("edition", true)
			.text("1")

		footer.
			append("span")
			.classed("url", true)
			.text("https://garage-trip.cz/cards")
	});
}

function loadCardsData(onLoad) {
	d3.csv("cards.csv").then(function(data) {
		data.forEach(function(d) {
			d.id = d.Name.toLowerCase().replace(/ /g, "_");
			let arr = []
				if (d.Race.length > 0)
					arr.push(d.Race);
			if (d.Tags.length > 0)
				for (let t of d.Tags.split(","))
					arr.push(t.trim());
			d.tgs = arr.sort();
		});
		onLoad(data);
	}).catch(function(err) {
		console.log(err);
	});
}
