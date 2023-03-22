
function makeImgSrc(d) {
	return "images/" + d.id + ".png";
}

function makeTags(d) {
	return d.tgs.join(", ");
}

function replaceImages(str) {
	return str
		.replace(/\\M/g, "<img src=\"media/military.png\" alt=\"M\">")
		.replace(/\\C/g, "<img src=\"media/culture.png\" alt=\"C\">")
		.replace(/\\F/g, "<img src=\"media/faith.png\" alt=\"F\">")
		.replace(/\$G/g, "<img src=\"media/gold.png\" alt=\"G\">")
		.replace(/\$M/g, "<img src=\"media/mana.png\" alt=\"M\">")
		.replace(/\$F/g, "<img src=\"media/fire.png\" alt=\"F\">");
}

function makeCosts(d) {
	let arr = [];
	for (let a of d.Cost.split(";"))
		arr.push(a.trim());
	return replaceImages(arr.join("<br>"));
}

function makeStats(d) {
	let arr = [];
	if (d.Military.length > 0)
		arr.push(d.Military + "&nbsp;\\M");
	if (d.Culture.length > 0)
		arr.push(d.Culture + "&nbsp;\\C");
	if (d.Faith.length > 0)
		arr.push(d.Faith + "&nbsp;\\F");
	return replaceImages(arr.join("&nbsp; "));
}

function makeDescription(d) {
	let arr = [];
	for (let a of d.Description.split(";"))
		arr.push(a.trim().replace(/^'/, ""));
	return replaceImages(arr.join("<br>"));
}

function makeLore(d) {
	let arr = [];
	for (let a of d.Lore.split(";"))
		arr.push(a.trim());
	return replaceImages(arr.join("<br>"));
}

function findCard(data, id) {
	for (let d of data) {
		if (d.id == id)
			return d;
	}
}

function updateCards(data) {
	d3.selectAll(".card").each(function() {
		let card = d3.select(this);
		let d = findCard(data, card.attr("data-card-id"));
		card.data([d]);
		for (let t of d.tgs)
			card.classed("tag-" + t, true);
		let cont = card.append("div").classed("container", true);

		cont.append("div")
			.classed("picture", true)
			.append("img")
			.attr("src", makeImgSrc)
			.attr("alt", makeImgSrc);

		let box = cont.append("div")
			.classed("box", true);

		cont.append("div")
			.classed("separator", true)
			.append("img")
			.attr("src", "media/separator.png");

		cont.append("div")
			.classed("name", true)
			.text(d => d.Name);

		let costs = makeCosts(d);
		if (costs.indexOf("img") > 0)
		{
			cont.append("div")
				.classed("costs", true)
				.html(costs);
		}

		let stats = makeStats(d);
		if (stats.indexOf("img") > 0)
		{
			cont.append("div")
				.classed("stats", true)
				.html(stats);
		}

		if (d.Description.length > 0) {
			box.append("div")
				.classed("description", true)
				.html(makeDescription);
		}

		if (d.Lore.length > 0) {
			box.append("div")
				.classed("lore", true)
				.html(makeLore);
		}

		cont.append("div")
			.classed("tags", true)
			.html(makeTags);

		card.append("div").attr("class", "corner top left");
		card.append("div").attr("class", "corner top right");
		card.append("div").attr("class", "corner bottom left");
		card.append("div").attr("class", "corner bottom right");

		card.append("div")
			.classed("cardscount", true)
			.text(d => d.Count);
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
