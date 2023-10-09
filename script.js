window.onload = function(){

function read_file(num) {
	const response = fetch("https://giwon2004.github.io/LoLstats/data/${num}.json");
	if (response.status === 200)
		return response.json;
	else
		return false;
}

function read_data() {
	var num = 0;
	var res = {};
	var data = {};
	while (true) {
		num++;
		data = read_file(num);
		if(data)
			res[num] = data;
		else
			break;
	}
	return {"data": res, "total": num};
}

function player_statistics(name, data){
	var win = 0;
	var lose = 0;
	var team = {};
	var position = {"top": 0, "jgl": 0, "mid": 0, "bot": 0, "sup": 0};
	var champion = {};
	for (var i = 1; i <= data["total"]; i++) {
		content = data["res"][i];
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
	}
	return {"win": win, "lose": lose, "total": win + lose, "position": position, "champion": champion};
}

function get_player_list() {
	const response = fetch("https://giwon2004.github.io/LoLstats/player_info.json");
	return response.json();
}

function make_list(data) {
	var html = "<ul>"
	for (let name of get_player_list()) {
		pstat = player_statistics(name, data);
		html += "\n\t<li>" + name + ":" + pstat["win"] + "</li>"
	}
	html += "\n</ul>";
	return html
}

var names = [];
data = read_data();
console.log(data);
}