window.onload = function(){
function read_files(dirname, process) {
	var count = 1;
	while (true) {
		try {
			var url = "https://giwon2004.github.io/LoLstats/data/" + count + ".json";
			var http = new XMLHttpRequest();
			http.open('HEAD', url, false);
			http.send();
			if (http.status == 404) break;
			
			fetch(url)
			.then(response => response.json())
			.then(data => process(data));
			count++;
		}
		catch {
			break;
		}
	}
}

function player_statistics(name){
	var win = 0;
	var lose = 0;
	var team = {};
	var position = {"top": 0, "jgl": 0, "mid": 0, "bot": 0, "sup": 0};
	var champion = {};
	read_files('data/', (content) => {
		if (name in content["teamA"])
			team = content["teamA"];
		else if (name in content["teamB"])
			team = content["teamA"];
		else
			return;
		player = team[name];
		if (!(player["champion"] in champion)) {
			champion[player["champion"]] = {"win": 0, "lose": 0};
		}
		if (team["status"] == "WIN") {
			win++;
			champion[player["champion"]]["win"]++;
		}
		else {
			lose++;
			champion[player["champion"]]["lose"]++;
		}
		position[player["position"]]++;

	});
	return {"win": win, "lose": lose, "total": win + lose, "position": position, "champion": champion};
}

function make_list(data) {
	var html = "<ul>"
	for (name in Object.keys(data)) {
		console.log(name);
		pstat = player_statistics(name);
		html += "\n\t<li>" + name + ":" + pstat["win"] + "</li>"
	}
	html += "\n</ul>";
	return html
}

var names = [];
fetch("https://giwon2004.github.io/LoLstats/player_info.json")
.then(response => response.json())
.then(data => document.getElementById("main").innerHTML = make_list(data));
}